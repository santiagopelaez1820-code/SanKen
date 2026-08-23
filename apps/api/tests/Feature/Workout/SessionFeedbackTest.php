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

    public function test_succeeding_on_the_first_session_ramps_reps_without_touching_weight(): void
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
        $fresh = $routineExercise->fresh();
        // Primera vez (sin objetivo previo): el peso NO sube todavía, recién
        // arranca la rampa de reps (10 reales -> 11 objetivo, +1 por serie).
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        $this->assertSame([11, 11, 11], $fresh->suggested_reps_per_set);
        $this->assertSame(0, $fresh->consecutive_failures);
    }

    public function test_reaching_the_rep_ceiling_and_meeting_it_again_increases_weight_and_resets_reps(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Simula que ya venía rampeando y llegó al techo de 12 en sesiones anteriores.
        $routineExercise->update(['suggested_weight_kg' => 100, 'suggested_reps_per_set' => [12, 12, 12]]);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->assertSame([12, 12, 12], $session['exercises'][0]['suggested_reps_per_set']);

        $weId = $session['exercises'][0]['id'];
        foreach ([1, 2, 3] as $_) {
            $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
                'weight_kg' => 100, 'reps' => 12,
            ]);
        }
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        $fresh = $routineExercise->fresh();
        // Ya estaba en el techo y lo cumplió de nuevo -> sube el peso (mismo incremento de siempre) y las reps vuelven al piso del rango original ("8-10" -> 8).
        $this->assertEquals(102.5, (float) $fresh->suggested_weight_kg);
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        $this->assertSame(0, $fresh->consecutive_failures);
    }

    public function test_ramping_reps_across_two_successful_sessions(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->logSuccessfulSets($client, $session1['id'], $session1['exercises'][0]['id']);
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/feedback", ['completed_as_planned' => true]);
        $this->assertSame([11, 11, 11], $routineExercise->fresh()->suggested_reps_per_set);

        // Sesión 2: el usuario ahora tiene que igualar/superar 11 en cada serie para seguir avanzando.
        $session2 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->assertSame([11, 11, 11], $session2['exercises'][0]['suggested_reps_per_set']);
        $weId = $session2['exercises'][0]['id'];
        foreach ([1, 2, 3] as $_) {
            $client->postJson("/api/v1/workout-sessions/{$session2['id']}/exercises/{$weId}/sets", [
                'weight_kg' => 100, 'reps' => 11,
            ]);
        }
        $client->postJson("/api/v1/workout-sessions/{$session2['id']}/feedback", ['completed_as_planned' => true]);

        $fresh = $routineExercise->fresh();
        $this->assertSame([12, 12, 12], $fresh->suggested_reps_per_set);
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
    }

    public function test_failing_holds_the_target_and_increments_consecutive_failures(): void
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
        // target_reps de la rutina es "8-10": el piso (8) es el objetivo de partida.
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        $this->assertSame(1, $fresh->consecutive_failures);
    }

    public function test_repeated_failures_never_reduce_the_weight(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $routineExercise->update(['consecutive_failures' => 1, 'suggested_reps_per_set' => [8, 8, 8]]);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $weId = $session['exercises'][0]['id'];
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 5]);

        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        $fresh = $routineExercise->fresh();
        // A diferencia del sistema anterior, ya no hay deload: el objetivo se sostiene sin importar cuántas fallas consecutivas haya.
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        $this->assertSame(2, $fresh->consecutive_failures);
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

    /**
     * Este es el bug real que reportó el usuario: la sesión 1 se configura a
     * mano (primera vez), pero la sesión 2 del mismo ejercicio debe traer
     * YA el peso/reps sugeridos actualizados sin que el usuario los vuelva
     * a configurar — sin cruzar por índice de array contra /routines/active,
     * que es exactamente la causa raíz que se corrigió (snapshot en
     * workout_exercises + invalidación de caché recién después de feedback).
     */
    public function test_progressive_overload_carries_over_automatically_to_the_next_session_without_manual_input(): void
    {
        $user = User::factory()->create();
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        $client = $this->actingAs($user, 'sanctum');

        // Sesión 1: el usuario configura peso/reps a mano (primera vez) y cumple el plan.
        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $this->assertNull($session1['exercises'][0]['suggested_weight_kg']);
        $this->assertNull($session1['exercises'][0]['suggested_reps_per_set']);
        $this->logSuccessfulSets($client, $session1['id'], $session1['exercises'][0]['id'], 100);
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/complete");
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/feedback", ['completed_as_planned' => true]);

        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
        $this->assertSame([11, 11, 11], $routineExercise->fresh()->suggested_reps_per_set);

        // Sesión 2: el usuario NO configura nada — el snapshot debe traer ya el peso/reps actualizados.
        $session2 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        $this->assertEquals(100.0, (float) $session2['exercises'][0]['suggested_weight_kg']);
        $this->assertSame([11, 11, 11], $session2['exercises'][0]['suggested_reps_per_set']);
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
