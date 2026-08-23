<?php

namespace Tests\Feature\Audit;

use App\Domain\Auth\Services\RecoveryCodeService;
use App\Models\Exercise;
use App\Models\TrainerClient;
use App\Models\User;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PragmaRX\Google2FA\Google2FA;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class ActivityLoggingTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    /**
     * @return array<string, mixed>
     */
    private function routinePayload(): array
    {
        $exerciseIds = Exercise::query()->orderBy('id')->limit(2)->pluck('id');

        return [
            'goal' => 'strength',
            'split_type' => 'upper_lower',
            'frequency_days' => 4,
            'duration_weeks' => 8,
            'days' => [
                [
                    'day_order' => 1,
                    'label' => 'Upper A',
                    'target_muscle_groups' => ['chest', 'back'],
                    'exercises' => [
                        [
                            'exercise_id' => $exerciseIds[0],
                            'order' => 1,
                            'target_sets' => 4,
                            'target_reps' => '3-6',
                            'rest_seconds' => 180,
                            'target_rpe' => 8.5,
                        ],
                        [
                            'exercise_id' => $exerciseIds[1],
                            'order' => 2,
                            'target_sets' => 3,
                            'target_reps' => '6-8',
                            'rest_seconds' => 120,
                        ],
                    ],
                ],
            ],
        ];
    }

    private function createActiveClient(User $trainer): TrainerClient
    {
        $client = User::factory()->create(['role' => 'user']);

        return TrainerClient::query()->create([
            'trainer_id' => $trainer->id,
            'client_id' => $client->id,
            'status' => 'active',
            'started_at' => now(),
        ]);
    }

    private function makeTwoFactorUser(): User
    {
        $user = User::factory()->create(['password' => 'Password!234']);
        $secret = (new Google2FA)->generateSecretKey();
        $recoveryCodes = new RecoveryCodeService;

        $user->forceFill([
            'two_factor_enabled' => true,
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => array_map(
                fn (string $code) => $recoveryCodes->hash($code),
                $recoveryCodes->generate(),
            ),
        ])->save();

        return $user->refresh();
    }

    public function test_trainer_client_status_change_writes_an_activity_log_entry(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);

        $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended'])
            ->assertOk();

        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'trainer_client',
            'event' => 'updated',
            'subject_type' => TrainerClient::class,
            'subject_id' => $trainerClient->id,
            'causer_type' => User::class,
            'causer_id' => $trainer->id,
        ]);

        $activity = Activity::query()
            ->where('subject_id', $trainerClient->id)
            ->where('event', 'updated')
            ->latest('id')
            ->first();
        $this->assertSame('ended', $activity->properties['attributes']['status']);
        $this->assertSame('active', $activity->properties['old']['status']);
    }

    public function test_creating_a_manual_routine_writes_an_activity_log_entry(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertCreated();

        $this->assertDatabaseHas('activity_log', [
            'log_name' => 'routine',
            'event' => 'created',
            'causer_type' => User::class,
            'causer_id' => $trainer->id,
        ]);

        $activity = Activity::query()->where('log_name', 'routine')->where('event', 'created')->latest('id')->first();
        $this->assertSame('trainer', $activity->properties['attributes']['source']);
    }

    public function test_updating_a_manual_routine_writes_an_activity_log_entry_for_top_level_fields_only(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $routineId = $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->json('data.id');

        $updatedPayload = $this->routinePayload();
        $updatedPayload['duration_weeks'] = 12;

        $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload)
            ->assertOk();

        $activity = Activity::query()
            ->where('log_name', 'routine')
            ->where('event', 'updated')
            ->where('subject_id', $routineId)
            ->latest('id')
            ->first();

        $this->assertNotNull($activity);
        $this->assertSame(12, $activity->properties['attributes']['duration_weeks']);
    }

    public function test_enabling_two_factor_alone_does_not_write_an_activity_log_row(): void
    {
        // refresh() so the in-memory model is fully hydrated (incl. DB-default columns like
        // role/is_banned/two_factor_enabled), matching a real authenticated request where the
        // user is always loaded fresh from the DB by the auth guard.
        $user = User::factory()->create()->refresh();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/enable')->assertOk();

        // The factory's own "created" row is expected (role/is_banned/two_factor_enabled are
        // always present on creation); what must NOT happen is an "updated" row from touching
        // only the untracked two_factor_secret column.
        $this->assertDatabaseMissing('activity_log', [
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'event' => 'updated',
        ]);
    }

    public function test_confirming_two_factor_writes_an_activity_log_entry_without_leaking_secrets(): void
    {
        $user = User::factory()->create()->refresh();
        $secret = (new Google2FA)->generateSecretKey();
        $user->forceFill(['two_factor_secret' => $secret])->save();
        $code = (new Google2FA)->getCurrentOtp($secret);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/2fa/confirm', ['code' => $code])
            ->assertOk();

        $activity = Activity::query()
            ->where('subject_type', User::class)
            ->where('subject_id', $user->id)
            ->where('event', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity);
        $this->assertSame(['two_factor_enabled'], array_keys($activity->properties['attributes']));
        $this->assertArrayNotHasKey('two_factor_secret', $activity->properties['attributes']);
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $activity->properties['attributes']);
    }

    public function test_disabling_two_factor_writes_an_activity_log_entry(): void
    {
        $user = $this->makeTwoFactorUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'Password!234'])
            ->assertOk();

        $activity = Activity::query()
            ->where('subject_type', User::class)
            ->where('subject_id', $user->id)
            ->where('event', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($activity);
        $this->assertFalse($activity->properties['attributes']['two_factor_enabled']);
        $this->assertArrayNotHasKey('two_factor_secret', $activity->properties['attributes']);
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $activity->properties['attributes']);
    }

    public function test_workout_activity_is_not_audited(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $exerciseId = Exercise::query()->value('id');
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);
        $workoutExercise = WorkoutExercise::query()->create([
            'workout_session_id' => $session->id,
            'exercise_id' => $exerciseId,
            'order' => 1,
        ]);
        WorkoutSet::query()->create([
            'workout_exercise_id' => $workoutExercise->id,
            'set_number' => 1,
            'weight_kg' => 60,
            'reps' => 8,
            'is_warmup' => false,
            'completed' => true,
        ]);

        $this->assertDatabaseMissing('activity_log', ['subject_type' => WorkoutSet::class]);
        $this->assertDatabaseMissing('activity_log', ['subject_type' => WorkoutSession::class]);
    }
}
