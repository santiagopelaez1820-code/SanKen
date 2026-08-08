<?php

namespace Tests\Feature\Workout;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\RoutineExercise;
use App\Models\User;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class SessionFeedbackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    /**
     * @return array{0: RoutineDay, 1: RoutineExercise}
     */
    private function makeRoutineDayWithOneExercise(User $user): array
    {
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        $routineExercise = RoutineExercise::query()->create([
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        return [$day->load('exercises'), $routineExercise];
    }

    private function logSuccessfulSets($client, int $sessionId, int $workoutExerciseId, float $weight = 100): void
    {
        foreach ([1, 2, 3] as $_) {
            $client->postJson("/api/v1/workout-sessions/{$sessionId}/exercises/{$workoutExerciseId}/sets", [
                'weight_kg' => $weight, 'reps' => 10,
            ]);
        }
    }

    public function test_succeeding_and_answering_yes_increases_the_suggested_weight(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->logSuccessfulSets($client, $session['id'], $session['exercises'][0]['id']);

        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", [
            'completed_as_planned' => true,
        ]);

        $response->assertOk();
        $this->assertEquals(102.5, (float) $routineExercise->fresh()->suggested_weight_kg);
        $this->assertSame(0, $routineExercise->fresh()->consecutive_failures);
    }

    public function test_failing_maintains_weight_and_increments_consecutive_failures(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        // Solo 2 de las 3 series objetivo: no cumple el target_sets.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        $fresh = $routineExercise->fresh();
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        $this->assertSame(1, $fresh->consecutive_failures);
    }

    public function test_two_consecutive_failures_trigger_a_deload(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $routineExercise->update(['consecutive_failures' => 1]);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 5]);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        $fresh = $routineExercise->fresh();
        $this->assertEquals(90.0, (float) $fresh->suggested_weight_kg);
        $this->assertSame(0, $fresh->consecutive_failures);
    }

    public function test_answering_no_never_increases_weight_even_if_sets_look_complete(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->logSuccessfulSets($client, $session['id'], $session['exercises'][0]['id']);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => false]);

        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
    }

    public function test_feedback_on_a_free_session_without_a_routine_day_does_not_error(): void
    {
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true])
            ->assertOk();
    }

    public function test_logging_a_heavier_set_is_flagged_as_a_new_personal_record(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];

        /** @var TestResponse $first */
        $first = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            'weight_kg' => 100, 'reps' => 10,
        ]);
        $first->assertJsonPath('data.is_personal_record', true);

        $second = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            'weight_kg' => 90, 'reps' => 8,
        ]);
        $second->assertJsonPath('data.is_personal_record', false);

        $this->assertDatabaseHas('personal_records', [
            'user_id' => $user->id,
            'record_type' => '1rm',
        ]);
        $this->assertDatabaseCount('personal_records', 1);
    }

    public function test_warmup_sets_are_never_personal_records(): void
    {
        $user = User::factory()->create();
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];

        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            'weight_kg' => 200, 'reps' => 10, 'is_warmup' => true,
        ]);

        $response->assertJsonPath('data.is_personal_record', false);
        $this->assertDatabaseCount('personal_records', 0);
    }
}
