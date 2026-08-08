<?php

namespace Tests\Feature\Trainer;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\TrainerClient;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ManualRoutineTest extends TestCase
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

    public function test_trainer_can_create_a_manual_routine_for_an_active_client(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);

        $response = $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload());

        $response->assertCreated()
            ->assertJsonPath('data.source', 'trainer')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(1, 'data.days')
            ->assertJsonCount(2, 'data.days.0.exercises');

        $this->assertDatabaseHas('routines', [
            'user_id' => $trainerClient->client_id,
            'created_by_trainer_id' => $trainer->id,
            'source' => 'trainer',
            'is_active' => true,
        ]);
    }

    public function test_creating_a_manual_routine_deactivates_the_clients_previous_active_routine(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);

        $previous = Routine::query()->create([
            'user_id' => $trainerClient->client_id,
            'source' => 'engine',
            'goal' => 'gain_muscle',
            'split_type' => 'full_body',
            'frequency_days' => 3,
            'duration_weeks' => 6,
            'is_active' => true,
        ]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertCreated();

        $this->assertDatabaseHas('routines', ['id' => $previous->id, 'is_active' => false]);
        $this->assertSame(1, Routine::query()->where('user_id', $trainerClient->client_id)->where('is_active', true)->count());
    }

    public function test_trainer_cannot_assign_a_routine_to_a_client_without_an_active_relationship(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $trainerClient->update(['status' => 'paused']);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors('trainer_client');
    }

    public function test_trainer_cannot_assign_a_routine_to_another_trainers_client(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($otherTrainer);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertForbidden();
    }

    public function test_trainer_can_update_their_own_manual_routine(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $routineId = $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->json('data.id');

        $updatedPayload = $this->routinePayload();
        $updatedPayload['duration_weeks'] = 12;
        $updatedPayload['days'][0]['label'] = 'Upper A (revisada)';

        $response = $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload);

        $response->assertOk()
            ->assertJsonPath('data.duration_weeks', 12)
            ->assertJsonPath('data.days.0.label', 'Upper A (revisada)');
    }

    public function test_trainer_cannot_update_a_routine_created_by_another_trainer(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($otherTrainer);
        $routineId = $this->actingAs($otherTrainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->json('data.id');

        $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $this->routinePayload())
            ->assertForbidden();
    }

    public function test_trainer_cannot_update_an_engine_generated_routine(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $client = User::factory()->create(['role' => 'user']);

        $engineRoutine = Routine::query()->create([
            'user_id' => $client->id,
            'source' => 'engine',
            'goal' => 'gain_muscle',
            'split_type' => 'full_body',
            'frequency_days' => 3,
            'duration_weeks' => 6,
            'is_active' => true,
        ]);

        $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/routines/{$engineRoutine->id}", $this->routinePayload())
            ->assertForbidden();
    }

    public function test_engine_never_overwrites_a_manually_assigned_routine(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $client = $trainerClient->client;
        $client->profile()->create(['age' => 30, 'sex' => 'male', 'height_cm' => 180, 'weight_kg' => 80]);
        $client->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell', 'dumbbells'],
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertCreated();

        $this->actingAs($client, 'sanctum')->postJson('/api/v1/routines/generate');

        $this->assertSame(1, Routine::query()->where('user_id', $client->id)->count());
        $this->assertDatabaseHas('routines', ['user_id' => $client->id, 'source' => 'trainer', 'is_active' => true]);
    }

    public function test_assigning_a_manual_routine_busts_the_clients_active_routine_cache(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $client = $trainerClient->client;

        Routine::query()->create([
            'user_id' => $client->id,
            'source' => 'engine',
            'goal' => 'gain_muscle',
            'split_type' => 'full_body',
            'frequency_days' => 3,
            'duration_weeks' => 6,
            'is_active' => true,
        ]);
        $this->actingAs($client, 'sanctum')->getJson('/api/v1/routines/active')->assertOk()->assertJsonPath('data.source', 'engine');

        $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->assertCreated();

        $this->actingAs($client, 'sanctum')
            ->getJson('/api/v1/routines/active')
            ->assertOk()
            ->assertJsonPath('data.source', 'trainer');
    }

    public function test_updating_a_manual_routine_busts_the_clients_active_routine_cache(): void
    {
        $this->seedCatalog();
        $trainer = User::factory()->create(['role' => 'trainer']);
        $trainerClient = $this->createActiveClient($trainer);
        $client = $trainerClient->client;
        $routineId = $this->actingAs($trainer, 'sanctum')
            ->postJson("/api/v1/trainer/clients/{$trainerClient->id}/routines", $this->routinePayload())
            ->json('data.id');

        $this->actingAs($client, 'sanctum')
            ->getJson('/api/v1/routines/active')
            ->assertOk()
            ->assertJsonPath('data.days.0.label', 'Upper A');

        $updatedPayload = $this->routinePayload();
        $updatedPayload['days'][0]['label'] = 'Upper A (revisada)';
        $this->actingAs($trainer, 'sanctum')
            ->patchJson("/api/v1/trainer/routines/{$routineId}", $updatedPayload)
            ->assertOk();

        $this->actingAs($client, 'sanctum')
            ->getJson('/api/v1/routines/active')
            ->assertOk()
            ->assertJsonPath('data.days.0.label', 'Upper A (revisada)');
    }
}
