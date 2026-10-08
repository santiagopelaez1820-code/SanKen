<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Workout.

namespace Tests\Feature\Workout;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineDay.
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo RoutineExercise.
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Carbon.
use Illuminate\Support\Carbon;
// Esta línea sirve para importar la clase TestResponse.
use Illuminate\Testing\TestResponse;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests SessionFeedbackTest.
class SessionFeedbackTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
    }

    /**
     * @return array{0: RoutineDay, 1: RoutineExercise}
     */
    // Esta línea sirve para declarar el método auxiliar que crea un día de rutina con un ejercicio.
    private function makeRoutineDayWithOneExercise(User $user): array
    {
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);

        // Esta línea sirve para crear un día de la rutina.
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body A', 'target_muscle_groups' => ['chest']]);

        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para crear el ejercicio del día.
        $routineExercise = RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        // Esta línea sirve para devolver el día y su ejercicio.
        return [$day->load('exercises'), $routineExercise];
    }

    // Esta línea sirve para declarar el método auxiliar que registra tres series exitosas.
    private function logSuccessfulSets($client, int $sessionId, int $workoutExerciseId, float $weight = 100): void
    {
        // Esta línea sirve para repetir tres veces.
        foreach ([1, 2, 3] as $_) {
            // Esta línea sirve para registrar una serie.
            $client->postJson("/api/v1/workout-sessions/{$sessionId}/exercises/{$workoutExerciseId}/sets", [
                // Esta línea sirve para enviar peso y 10 repeticiones.
                'weight_kg' => $weight, 'reps' => 10,
            ]);
        }
    }

    // Esta línea sirve para declarar el test que comprueba que tener éxito en la primera sesión sube repeticiones sin tocar el peso.
    public function test_succeeding_on_the_first_session_ramps_reps_without_touching_weight(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para registrar tres series exitosas.
        $this->logSuccessfulSets($client, $session['id'], $session['exercises'][0]['id']);

        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", [
            // Esta línea sirve para asignar true al campo "completed_as_planned".
            'completed_as_planned' => true,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para recargar el ejercicio de la rutina.
        $fresh = $routineExercise->fresh();
        // Primera vez (sin objetivo previo): el peso NO sube todavía, recién
        // arranca la rampa de reps (10 reales -> 11 objetivo, +1 por serie).
        // Esta línea sirve para exigir que el peso sugerido sea 100.
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        // Esta línea sirve para exigir que las repeticiones sugeridas sean 11 por serie.
        $this->assertSame([11, 11, 11], $fresh->suggested_reps_per_set);
        // Esta línea sirve para exigir que "consecutive_failures" sea exactamente 0.
        $this->assertSame(0, $fresh->consecutive_failures);
    }

    // Esta línea sirve para declarar el test que comprueba que al llegar al techo de repeticiones sube el peso y se reinician las repeticiones.
    public function test_reaching_the_rep_ceiling_and_meeting_it_again_increases_weight_and_resets_reps(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Simula que ya venía rampeando y llegó al techo de 12 en sesiones anteriores.
        // Esta línea sirve para fijar como sugerencia 100 kg con 12 repeticiones.
        $routineExercise->update(['suggested_weight_kg' => 100, 'suggested_reps_per_set' => [12, 12, 12]]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para exigir que la sesión muestre las repeticiones sugeridas.
        $this->assertSame([12, 12, 12], $session['exercises'][0]['suggested_reps_per_set']);

        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para repetir tres veces.
        foreach ([1, 2, 3] as $_) {
            // Esta línea sirve para registrar una serie.
            $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
                // Esta línea sirve para enviar 100 kg x 12.
                'weight_kg' => 100, 'reps' => 12,
            ]);
        }
        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        // Esta línea sirve para recargar el ejercicio de la rutina.
        $fresh = $routineExercise->fresh();
        // Ya estaba en el techo y lo cumplió de nuevo -> sube el peso (mismo incremento de siempre) y las reps vuelven al piso del rango original ("8-10" -> 8).
        // Esta línea sirve para exigir que el peso suba a 102,5.
        $this->assertEquals(102.5, (float) $fresh->suggested_weight_kg);
        // Esta línea sirve para exigir que las repeticiones vuelvan a 8.
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        // Esta línea sirve para exigir que "consecutive_failures" sea exactamente 0.
        $this->assertSame(0, $fresh->consecutive_failures);
    }

    // Esta línea sirve para declarar el test que comprueba que las repeticiones suben a lo largo de dos sesiones exitosas.
    public function test_ramping_reps_across_two_successful_sessions(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar la primera sesión.
        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para registrar tres series exitosas.
        $this->logSuccessfulSets($client, $session1['id'], $session1['exercises'][0]['id']);
        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/feedback", ['completed_as_planned' => true]);
        // Esta línea sirve para exigir que la sugerencia sea 11 repeticiones.
        $this->assertSame([11, 11, 11], $routineExercise->fresh()->suggested_reps_per_set);

        // Sesión 2: el usuario ahora tiene que igualar/superar 11 en cada serie para seguir avanzando.
        // Esta línea sirve para iniciar la segunda sesión.
        $session2 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para exigir que muestre 11 repeticiones sugeridas.
        $this->assertSame([11, 11, 11], $session2['exercises'][0]['suggested_reps_per_set']);
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session2['exercises'][0]['id'];
        // Esta línea sirve para repetir tres veces.
        foreach ([1, 2, 3] as $_) {
            // Esta línea sirve para registrar una serie.
            $client->postJson("/api/v1/workout-sessions/{$session2['id']}/exercises/{$weId}/sets", [
                // Esta línea sirve para enviar 100 kg x 11.
                'weight_kg' => 100, 'reps' => 11,
            ]);
        }
        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session2['id']}/feedback", ['completed_as_planned' => true]);

        // Esta línea sirve para recargar el ejercicio de la rutina.
        $fresh = $routineExercise->fresh();
        // Esta línea sirve para exigir que la sugerencia sea 12 repeticiones.
        $this->assertSame([12, 12, 12], $fresh->suggested_reps_per_set);
        // Esta línea sirve para exigir que el peso siga en 100.
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
    }

    // Esta línea sirve para declarar el test que comprueba que fallar mantiene la meta y suma una falla consecutiva.
    public function test_failing_holds_the_target_and_increments_consecutive_failures(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];
        // Solo 2 de las 3 series objetivo: no cumple el target_sets.
        // Esta línea sirve para registrar una primera serie.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para registrar una segunda serie (falta la tercera).
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        // Esta línea sirve para recargar el ejercicio de la rutina.
        $fresh = $routineExercise->fresh();
        // Esta línea sirve para exigir que el peso siga en 100.
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        // target_reps de la rutina es "8-10": el piso (8) es el objetivo de partida.
        // Esta línea sirve para exigir que la sugerencia siga en 8 repeticiones.
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        // Esta línea sirve para exigir que "consecutive_failures" sea exactamente 1.
        $this->assertSame(1, $fresh->consecutive_failures);
    }

    // Esta línea sirve para declarar el test que comprueba que las fallas repetidas nunca bajan el peso.
    public function test_repeated_failures_never_reduce_the_weight(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para marcar una falla previa y sugerir 8 repeticiones.
        $routineExercise->update(['consecutive_failures' => 1, 'suggested_reps_per_set' => [8, 8, 8]]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie floja de 5 repeticiones.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 5]);

        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true]);

        // Esta línea sirve para recargar el ejercicio de la rutina.
        $fresh = $routineExercise->fresh();
        // A diferencia del sistema anterior, ya no hay deload: el objetivo se sostiene sin importar cuántas fallas consecutivas haya.
        // Esta línea sirve para exigir que el peso siga en 100.
        $this->assertEquals(100.0, (float) $fresh->suggested_weight_kg);
        // Esta línea sirve para exigir que la sugerencia siga en 8 repeticiones.
        $this->assertSame([8, 8, 8], $fresh->suggested_reps_per_set);
        // Esta línea sirve para exigir que "consecutive_failures" sea exactamente 2.
        $this->assertSame(2, $fresh->consecutive_failures);
    }

    // Esta línea sirve para declarar el test que comprueba que responder "no" nunca sube el peso aunque las series parezcan completas.
    public function test_answering_no_never_increases_weight_even_if_sets_look_complete(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para registrar tres series exitosas.
        $this->logSuccessfulSets($client, $session['id'], $session['exercises'][0]['id']);

        // Esta línea sirve para enviar el feedback de que no se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => false]);

        // Esta línea sirve para exigir que el peso siga en 100.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
    }

    // Esta línea sirve para declarar el test que comprueba que el feedback de una sesión libre no da error.
    public function test_feedback_on_a_free_session_without_a_routine_day_does_not_error(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar una sesión libre.
        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');

        // Esta línea sirve para enviar el feedback.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/feedback", ['completed_as_planned' => true])
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk();
    }

    // Esta línea sirve para declarar el test que comprueba que una serie más pesada se marca como nuevo récord.
    public function test_logging_a_heavier_set_is_flagged_as_a_new_personal_record(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];

        // Esta línea sirve para registrar una serie de 100 kg x 10.
        /** @var TestResponse $first */
        $first = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);
        // Esta línea sirve para exigir que "data.is_personal_record" sea true.
        $first->assertJsonPath('data.is_personal_record', true);

        // Esta línea sirve para registrar una serie más liviana de 90 kg x 8.
        $second = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 90, 'reps' => 8,
        ]);
        // Esta línea sirve para exigir que "data.is_personal_record" sea false.
        $second->assertJsonPath('data.is_personal_record', false);

        // Esta línea sirve para exigir que la tabla personal_records tenga un registro con estos datos.
        $this->assertDatabaseHas('personal_records', [
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar '1rm' al campo "record_type".
            'record_type' => '1rm',
        ]);
        // Esta línea sirve para exigir que la tabla personal_records tenga 1 registros.
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
    // Esta línea sirve para declarar el test que comprueba que la sobrecarga progresiva pasa sola a la siguiente sesión.
    public function test_progressive_overload_carries_over_automatically_to_the_next_session_without_manual_input(): void
    {
        // Sesión 2 tiene que caer en otro día calendario: con el desbloqueo
        // diario, repetir el mismo routine_day_id el mismo día ya está
        // bloqueado por el backend (ver DailyLockTest) — igual que en el uso
        // real, "la próxima sesión" de este día del split solo puede volver
        // a jugarse cuando la rotación lo trae de vuelta, en otra fecha.
        // Esta línea sirve para fijar la fecha actual en 2026-01-01 10:00:00.
        Carbon::setTestNow(Carbon::parse('2026-01-01 10:00:00'));

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day, $routineExercise] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Sesión 1: el usuario configura peso/reps a mano (primera vez) y cumple el plan.
        // Esta línea sirve para iniciar la primera sesión.
        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para exigir que aún no tenga peso sugerido.
        $this->assertNull($session1['exercises'][0]['suggested_weight_kg']);
        // Esta línea sirve para exigir que aún no tenga repeticiones sugeridas.
        $this->assertNull($session1['exercises'][0]['suggested_reps_per_set']);
        // Esta línea sirve para registrar tres series exitosas.
        $this->logSuccessfulSets($client, $session1['id'], $session1['exercises'][0]['id'], 100);
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/complete");
        // Esta línea sirve para enviar el feedback de que se hizo como estaba planeado.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/feedback", ['completed_as_planned' => true]);

        // Esta línea sirve para exigir que el peso sugerido sea 100.
        $this->assertEquals(100.0, (float) $routineExercise->fresh()->suggested_weight_kg);
        // Esta línea sirve para exigir que las repeticiones sugeridas sean 11 por serie.
        $this->assertSame([11, 11, 11], $routineExercise->fresh()->suggested_reps_per_set);

        // Esta línea sirve para fijar la fecha actual en 2026-01-02 10:00:00.
        Carbon::setTestNow(Carbon::parse('2026-01-02 10:00:00'));

        // Sesión 2: el usuario NO configura nada — el snapshot debe traer ya el peso/reps actualizados.
        // Esta línea sirve para iniciar la segunda sesión.
        $session2 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para exigir que muestre el peso sugerido de 100.
        $this->assertEquals(100.0, (float) $session2['exercises'][0]['suggested_weight_kg']);
        // Esta línea sirve para exigir que muestre 11 repeticiones sugeridas.
        $this->assertSame([11, 11, 11], $session2['exercises'][0]['suggested_reps_per_set']);

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que las series de calentamiento nunca son récords.
    public function test_warmup_sets_are_never_personal_records(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];

        // Esta línea sirve para registrar una serie de calentamiento.
        $response = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            // Esta línea sirve para enviar peso, repeticiones y marcarla como calentamiento.
            'weight_kg' => 200, 'reps' => 10, 'is_warmup' => true,
        ]);

        // Esta línea sirve para exigir que "data.is_personal_record" sea false.
        $response->assertJsonPath('data.is_personal_record', false);
        // Esta línea sirve para exigir que la tabla personal_records tenga 0 registros.
        $this->assertDatabaseCount('personal_records', 0);
    }
}
