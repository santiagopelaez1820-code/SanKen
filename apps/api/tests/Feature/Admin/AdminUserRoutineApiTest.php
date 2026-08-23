<?php

namespace Tests\Feature\Admin;

use App\Models\Exercise;
use App\Models\PersonalRecord;
use App\Models\Routine;
use App\Models\User;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Database\Seeders\RoutineTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserRoutineApiTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): void
    {
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
        // Necesario para /routines/generate (usado al probar que el motor
        // no pisa una rutina personalizada, y al revertir a la general).
        $this->seed(RoutineTemplateSeeder::class);
    }

    /**
     * @return array<string, mixed>
     */
    private function routinePayload(string $label = 'Full A'): array
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
                    'label' => $label,
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

    public function test_non_admin_cannot_manage_personal_routines(): void
    {
        $this->seedCatalog();
        $user = User::factory()->create();
        $target = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertForbidden();
    }

    public function test_admin_can_assign_a_personal_routine_and_it_deactivates_the_users_previous_active_routine(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $previous = Routine::query()->create([
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload());

        $response->assertCreated()
            ->assertJsonPath('data.source', 'admin')
            ->assertJsonPath('data.is_active', true)
            ->assertJsonCount(1, 'data.days');

        $this->assertDatabaseHas('routines', [
            'user_id' => $target->id, 'created_by_admin_id' => $admin->id, 'source' => 'admin', 'is_active' => true,
        ]);
        $this->assertDatabaseHas('routines', ['id' => $previous->id, 'is_active' => false]);
    }

    public function test_assigning_a_personal_routine_does_not_affect_other_users(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherRoutine = Routine::query()->create([
            'user_id' => $otherUser->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $this->assertDatabaseHas('routines', ['id' => $otherRoutine->id, 'is_active' => true, 'source' => 'engine']);
    }

    public function test_admin_can_view_a_users_current_active_routine(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$target->id}/routine");

        $response->assertOk()->assertJsonPath('data.source', 'admin');
    }

    public function test_admin_can_update_a_personal_routine_replacing_its_days(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $this->actingAs($admin, 'sanctum');
        $routineId = $this->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())->json('data.id');

        $updated = $this->routinePayload('Full A (editada)');
        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/routines/{$routineId}", $updated);

        $response->assertOk()->assertJsonPath('data.days.0.label', 'Full A (editada)');
    }

    public function test_cannot_update_a_non_personalized_routine_through_this_action(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $engineRoutine = Routine::query()->create([
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/routines/{$engineRoutine->id}", $this->routinePayload())
            ->assertStatus(422);
    }

    public function test_admin_can_revert_a_personal_routine_to_the_general_template(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        $target->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/users/{$target->id}/routine");

        $response->assertOk()->assertJsonPath('data.source', 'engine');
        $this->assertSame(1, Routine::query()->where('user_id', $target->id)->where('is_active', true)->count());
        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => false]);
    }

    public function test_cannot_revert_when_the_user_has_no_active_personal_routine(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        Routine::query()->create([
            'user_id' => $target->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/users/{$target->id}/routine")
            ->assertStatus(422);
    }

    public function test_cannot_revert_when_the_target_user_never_completed_onboarding(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/users/{$target->id}/routine")
            ->assertStatus(422);

        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => true]);
    }

    public function test_engine_never_overwrites_an_admin_assigned_routine(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        $target->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $this->actingAs($target, 'sanctum')->postJson('/api/v1/routines/generate');

        $this->assertSame(1, Routine::query()->where('user_id', $target->id)->count());
        $this->assertDatabaseHas('routines', ['user_id' => $target->id, 'source' => 'admin', 'is_active' => true]);
    }

    public function test_assigning_editing_and_reverting_a_personal_routine_never_touches_completed_workout_history(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $target->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);
        $target->onboardingResponse()->create([
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
            'session_minutes' => 60, 'place' => 'gym', 'equipment_available' => ['barbell'],
            'injuries' => [], 'completed' => true, 'completed_at' => now(),
        ]);
        $exercise = Exercise::query()->orderBy('id')->first();

        $session = WorkoutSession::query()->create([
            'user_id' => $target->id, 'routine_day_id' => null, 'performed_at' => now()->toDateString(),
            'duration_minutes' => 45, 'completed' => true,
        ]);
        $workoutExercise = WorkoutExercise::query()->create([
            'workout_session_id' => $session->id, 'exercise_id' => $exercise->id, 'order' => 1, 'all_sets_completed' => true,
        ]);
        $set = $workoutExercise->sets()->create([
            'set_number' => 1, 'weight_kg' => 100, 'reps' => 5, 'rpe' => 8, 'completed' => true,
        ]);
        $pr = PersonalRecord::query()->create([
            'user_id' => $target->id, 'exercise_id' => $exercise->id, 'record_type' => '1rm',
            'value' => 100, 'achieved_at' => now()->toDateString(), 'workout_set_id' => $set->id,
        ]);

        $this->actingAs($admin, 'sanctum');
        $routineId = $this->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())->json('data.id');
        $this->patchJson("/api/v1/admin/routines/{$routineId}", $this->routinePayload('Editada'))->assertOk();
        $this->deleteJson("/api/v1/admin/users/{$target->id}/routine")->assertOk();

        $this->assertDatabaseHas('workout_sessions', ['id' => $session->id, 'completed' => true]);
        $this->assertDatabaseHas('workout_exercises', ['id' => $workoutExercise->id, 'exercise_id' => $exercise->id]);
        $this->assertDatabaseHas('workout_sets', ['id' => $set->id, 'weight_kg' => 100, 'reps' => 5]);
        $this->assertDatabaseHas('personal_records', ['id' => $pr->id, 'value' => 100]);
    }

    public function test_admin_user_detail_exposes_current_routine_summary(): void
    {
        $this->seedCatalog();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $target = User::factory()->create();
        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$target->id}/routine", $this->routinePayload())
            ->assertCreated();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/users/{$target->id}");

        $response->assertOk()
            ->assertJsonPath('data.current_routine.source', 'admin')
            ->assertJsonPath('data.current_routine.label', 'Personalizada');
    }
}
