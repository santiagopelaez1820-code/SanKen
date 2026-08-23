<?php

namespace Tests\Feature\Workout;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use App\Models\WorkoutSession;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutSessionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function makeActiveRoutineWithOneDay(User $user): RoutineDay
    {
        $routine = Routine::query()->create([
            'user_id' => $user->id,
            'source' => 'engine',
            'goal' => 'gain_muscle',
            'split_type' => 'full_body',
            'frequency_days' => 3,
            'duration_weeks' => 6,
            'is_active' => true,
        ]);

        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        RoutineExercise::query()->create([
            'routine_day_id' => $day->id,
            'exercise_id' => $exerciseId,
            'order' => 1,
            'target_sets' => 3,
            'target_reps' => '8-10',
            'rest_seconds' => 90,
            'target_rpe' => 8.0,
        ]);

        return $day->load('exercises');
    }

    public function test_starting_a_session_from_a_routine_day_preloads_its_exercises(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', [
            'routine_day_id' => $day->id,
            'sleep_quality' => 4,
            'energy_level' => 3,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.routine_day_id', $day->id)
            ->assertJsonCount(1, 'data.exercises')
            ->assertJsonPath('data.exercises.0.exercise.name', 'Press banca con barra');
    }

    public function test_starting_a_free_session_without_a_routine_day_works(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/workout-sessions', []);

        $response->assertCreated()
            ->assertJsonPath('data.routine_day_id', null)
            ->assertJsonCount(0, 'data.exercises');
    }

    public function test_user_cannot_start_a_session_from_another_users_routine_day(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($owner);

        $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])
            ->assertForbidden();
    }

    public function test_user_can_log_sets_for_an_exercise_in_order(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];

        $set1 = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);
        $set2 = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 95, 'reps' => 10,
        ]);

        $set1->assertCreated()->assertJsonPath('data.set_number', 1);
        $set2->assertCreated()->assertJsonPath('data.set_number', 2);
    }

    public function test_user_can_correct_a_logged_set(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];
        $set = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ])->json('data');

        $response = $client->patchJson("/api/v1/workout-sets/{$set['id']}", ['reps' => 8]);

        $response->assertOk()->assertJsonPath('data.reps', 8);
        $this->assertEquals(100.0, $response->json('data.weight_kg'));
    }

    public function test_another_users_set_cannot_be_edited(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($owner);
        $ownerClient = $this->actingAs($owner, 'sanctum');

        $session = $ownerClient->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];
        $set = $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ])->json('data');

        $this->actingAs($intruder, 'sanctum')
            ->patchJson("/api/v1/workout-sets/{$set['id']}", ['reps' => 1])
            ->assertForbidden();
    }

    public function test_user_can_add_an_extra_exercise_mid_session(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        $extraExerciseId = Exercise::query()->where('name', 'Curl de bíceps con mancuernas')->value('id');

        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            'exercise_id' => $extraExerciseId,
        ]);

        $response->assertCreated()->assertJsonPath('data.order', 2);
    }

    public function test_user_can_mark_an_exercise_as_fully_completed(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];

        $response = $client->patchJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}", [
            'all_sets_completed' => true,
        ]);

        $response->assertOk()->assertJsonPath('data.all_sets_completed', true);
    }

    public function test_user_can_complete_a_session(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [
            'duration_minutes' => 52,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.completed', true)
            ->assertJsonPath('data.duration_minutes', 52);
    }

    public function test_next_day_rotates_after_completing_a_session(): void
    {
        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);
        $client = $this->actingAs($user, 'sanctum');

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertSame($dayA->id, $active['meta']['next_day_id']);

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete");

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);
    }

    public function test_a_fourth_set_is_rejected_and_the_exercise_auto_completes_at_three(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];

        $this->assertSame(3, $session['exercises'][0]['target_sets']);

        foreach ([1, 2, 3] as $setNumber) {
            $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
                'weight_kg' => 100, 'reps' => 10,
            ]);
            $response->assertCreated()->assertJsonPath('data.set_number', $setNumber);
        }

        $this->assertDatabaseHas('workout_exercises', ['id' => $exerciseId, 'all_sets_completed' => true]);

        $fourth = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);

        $fourth->assertStatus(422);
        $fourth->assertJsonPath('errors.sets.0', 'Ya completaste las 3 series de este ejercicio.');
        $this->assertDatabaseCount('workout_sets', 3);
    }

    public function test_skipping_a_workout_creates_no_exercises_or_sets_and_still_rotates_the_next_day(): void
    {
        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        $routineExercise = RoutineExercise::query()->create([
            'routine_day_id' => $dayA->id, 'exercise_id' => $exerciseId, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
            'suggested_weight_kg' => 100,
        ]);
        $client = $this->actingAs($user, 'sanctum');

        $response = $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayA->id]);

        $response->assertCreated();
        $response->assertJsonPath('data.skipped', true);
        $response->assertJsonPath('data.completed', false);
        $this->assertSame(0, count($response->json('data.exercises')));

        $sessionId = $response->json('data.id');
        $this->assertDatabaseCount('workout_exercises', 0);
        $this->assertDatabaseCount('workout_sets', 0);
        $this->assertNotNull(WorkoutSession::query()->find($sessionId)->skipped_at);

        // No debe tocar la progresión: suggested_weight_kg queda intacto.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);
    }

    public function test_user_can_cancel_an_in_progress_session_without_marking_it_completed(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);

        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel");

        $response->assertOk()
            ->assertJsonPath('data.cancelled', true)
            ->assertJsonPath('data.completed', false);

        // Las series ya registradas se conservan, no se borran al cancelar.
        $this->assertDatabaseCount('workout_sets', 1);
        $this->assertNotNull(WorkoutSession::query()->find($session['id'])->cancelled_at);
    }

    public function test_cancelling_a_session_does_not_affect_progressive_overload(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $routineExercise = $day->exercises->first();
        $routineExercise->update(['suggested_weight_kg' => 100]);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $exerciseId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$exerciseId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Cancelar nunca pasa por SubmitSessionFeedbackAction: la sugerencia
        // de peso queda exactamente igual que antes de la sesión cancelada.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
        $this->assertEquals(0, $routineExercise->fresh()->consecutive_failures);
    }

    public function test_a_cancelled_session_cannot_later_be_completed(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")
            ->assertUnprocessable();

        $this->assertFalse(WorkoutSession::query()->find($session['id'])->completed);
    }

    public function test_a_completed_session_cannot_be_cancelled(): void
    {
        $user = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")
            ->assertUnprocessable();

        $this->assertNull(WorkoutSession::query()->find($session['id'])->cancelled_at);
    }

    public function test_another_users_session_cannot_be_cancelled(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $day = $this->makeActiveRoutineWithOneDay($owner);

        $session = $this->actingAs($owner, 'sanctum')
            ->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        $this->actingAs($intruder, 'sanctum')
            ->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")
            ->assertForbidden();
    }
}
