<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Workout.

namespace Tests\Feature\Workout;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineExercise.
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Carbon.
use Illuminate\Support\Carbon;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Desbloqueo diario: completar (o saltar) el entrenamiento de hoy bloquea el
 * siguiente día de rutina hasta las 00:00 (UTC, ver DetermineDailyLockStatusAction)
 * del día calendario siguiente. La autoridad es siempre now() del servidor.
 */
// Esta línea sirve para declarar la clase de tests DailyLockTest.
class DailyLockTest extends TestCase
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

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
    }

    /** @return array{0: Routine, 1: object, 2: object} [$routine, $dayA, $dayB] */
    // Esta línea sirve para declarar el método auxiliar que crea una rutina de dos días.
    private function makeTwoDayRoutine(User $user): array
    {
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear el día A.
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        // Esta línea sirve para crear el día B.
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);

        // Esta línea sirve para devolver la rutina y sus dos días.
        return [$routine, $dayA, $dayB];
    }

    // Esta línea sirve para declarar el test que comprueba que no hay bloqueo si todavía no se completó nada.
    public function test_daily_lock_is_unlocked_when_nothing_was_completed_yet(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();

        // Esta línea sirve para exigir que no esté bloqueada.
        $this->assertFalse($active['meta']['daily_lock']['locked']);
        // Esta línea sirve para exigir que no tenga hora de desbloqueo.
        $this->assertNull($active['meta']['daily_lock']['unlocks_at']);
        // Esta línea sirve para exigir que el próximo día sea el A.
        $this->assertSame($dayA->id, $active['meta']['next_day_id']);
    }

    // Esta línea sirve para declarar el test que comprueba que completar el entrenamiento de hoy bloquea el siguiente de inmediato.
    public function test_completing_todays_workout_locks_the_next_one_immediately(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-09-16 20:30:00.
        Carbon::setTestNow(Carbon::parse('2026-09-16 20:30:00'));
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();

        // Esta línea sirve para exigir que esté bloqueada.
        $this->assertTrue($active['meta']['daily_lock']['locked']);
        // Esta línea sirve para exigir que el motivo sea "completed".
        $this->assertSame('completed', $active['meta']['daily_lock']['reason']);
        // 20:30 -> bloqueado hasta las 00:00 del día calendario siguiente, no
        // "24 horas después" (eso serían las 20:30 del día siguiente).
        // Esta línea sirve para exigir que se desbloquee a la medianoche del día siguiente.
        $this->assertSame('2026-09-17T00:00:00+00:00', $active['meta']['daily_lock']['unlocks_at']);
    }

    // Esta línea sirve para declarar el test que comprueba que el backend rechaza iniciar el día siguiente mientras está bloqueado.
    public function test_starting_the_next_days_session_is_rejected_by_the_backend_while_locked(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar y completar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // next_day_id ya rotó a dayB (eso no cambia, ver WorkoutSessionTest),
        // pero el backend igual tiene que rechazar arrancarlo hoy -- este es
        // el guardrail real, no la UI.
        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que el próximo día sea el B.
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);

        // Esta línea sirve para intentar iniciar el día B.
        $response = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayB->id]);

        // Esta línea sirve para exigir que la respuesta sea 422.
        $response->assertStatus(422);
        // Esta línea sirve para exigir que el mensaje mencione la hora de desbloqueo.
        $this->assertStringContainsString('00:00', $response->json('errors.routine_day_id.0'));
        // Esta línea sirve para exigir que la tabla workout_sessions tenga 1 registros.
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que saltar el entrenamiento también bloquea y un segundo salto se rechaza.
    public function test_skipping_todays_workout_also_locks_and_a_second_skip_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para saltar el día A y exigir 201.
        $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayA->id])->assertCreated();

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que esté bloqueada.
        $this->assertTrue($active['meta']['daily_lock']['locked']);
        // Esta línea sirve para exigir que el motivo sea "skipped".
        $this->assertSame('skipped', $active['meta']['daily_lock']['reason']);

        // Sin este guardrail, saltar repetidas veces sería la forma de
        // saltarse el bloqueo diario avanzando un día por request.
        // Esta línea sirve para intentar saltar el día B.
        $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayB->id])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
        // Esta línea sirve para exigir que la tabla workout_sessions tenga 1 registros.
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que las sesiones libres no se bloquean.
    public function test_free_sessions_without_a_routine_day_are_not_gated_by_the_daily_lock(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Una sesión libre no es "el próximo día del programa" -- no está
        // sujeta al desbloqueo diario (alcance documentado en el resumen).
        // Esta línea sirve para iniciar una sesión libre y exigir 201.
        $client->postJson('/api/v1/workout-sessions', [])->assertCreated();
    }

    // Esta línea sirve para declarar el test que comprueba que sigue bloqueado un segundo antes de la medianoche.
    public function test_still_locked_one_second_before_midnight(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-09-16 23:50:00.
        Carbon::setTestNow(Carbon::parse('2026-09-16 23:50:00'));
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Entrenar tarde a la noche no debería dar horas de espera de más: el
        // desbloqueo sigue siendo a las 00:00, solo 10 minutos después.
        // Esta línea sirve para fijar la fecha actual en 2026-09-16 23:59:59.
        Carbon::setTestNow(Carbon::parse('2026-09-16 23:59:59'));
        // Esta línea sirve para pedir la rutina activa.
        $stillLocked = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que siga bloqueada.
        $this->assertTrue($stillLocked['meta']['daily_lock']['locked']);
    }

    // Esta línea sirve para declarar el test que comprueba que se desbloquea justo a la medianoche del día siguiente.
    public function test_unlocks_exactly_at_midnight_of_the_next_calendar_day(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-09-16 08:00:00.
        Carbon::setTestNow(Carbon::parse('2026-09-16 08:00:00'));
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Esta línea sirve para fijar la fecha actual en 2026-09-17 00:00:00.
        Carbon::setTestNow(Carbon::parse('2026-09-17 00:00:00'));

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que ya no esté bloqueada.
        $this->assertFalse($active['meta']['daily_lock']['locked']);

        // Y el backend ahora sí deja arrancar el día siguiente -- no hace
        // falta reinstalar la app ni borrar caché, el estado es 100% server-side.
        // Esta línea sirve para iniciar el día B.
        $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayB->id])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();
    }

    // Esta línea sirve para declarar el test que comprueba que una sesión completada de un día anterior no bloquea hoy.
    public function test_a_completed_session_from_a_previous_day_does_not_lock_today(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [$routine, $dayA] = $this->makeTwoDayRoutine($user);

        // Sesión histórica (usuario/dato ya existente antes de esta feature)
        // de ayer -- no debe afectar el estado de hoy.
        // Esta línea sirve para crear una sesión completada de ayer.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar $dayA->id al campo "routine_day_id".
            'routine_day_id' => $dayA->id,
            // Esta línea sirve para asignar now()->subDay()->toDateString() al campo "performed_at".
            'performed_at' => now()->subDay()->toDateString(),
            // Esta línea sirve para asignar true al campo "completed".
            'completed' => true,
        ]);

        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();

        // Esta línea sirve para exigir que no esté bloqueada.
        $this->assertFalse($active['meta']['daily_lock']['locked']);
    }

    // Esta línea sirve para declarar el test que comprueba que una sesión cancelada hoy no bloquea la siguiente.
    public function test_a_cancelled_session_today_does_not_lock_the_next_one(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento del día A.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para cancelarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Esta línea sirve para pedir la rutina activa.
        $active = $client->getJson('/api/v1/routines/active')->json();
        // Esta línea sirve para exigir que no esté bloqueada.
        $this->assertFalse($active['meta']['daily_lock']['locked']);

        // Al no haber quedado bloqueado, el mismo día de rutina se puede
        // volver a intentar -- y retoma la MISMA sesión (ver
        // test_cancelling_and_restarting_the_same_day_resumes_the_same_session_with_progress_intact),
        // no crea una segunda.
        // Esta línea sirve para iniciar de nuevo el día A.
        $resumed = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        // Esta línea sirve para exigir que se retome la misma sesión.
        $this->assertSame($session['id'], $resumed['id']);
        // Esta línea sirve para exigir que la tabla workout_sessions tenga 1 registros.
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que cancelar y reiniciar el mismo día retoma la sesión con su progreso.
    public function test_cancelling_and_restarting_the_same_day_resumes_the_same_session_with_progress_intact(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 1, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear el día de la rutina.
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body', 'target_muscle_groups' => []]);
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        // Esta línea sirve para crear el ejercicio del día.
        RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $workoutExerciseId = $session['exercises'][0]['id'];

        // El usuario registra 2 de las 3 series pedidas...
        // Esta línea sirve para registrar una serie de 80 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 10])->assertCreated();
        // Esta línea sirve para registrar una serie de 80 kg x 9.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 9])->assertCreated();

        // ...y sale sin terminar (cancela desde la pantalla de entrenamiento).
        // Esta línea sirve para cancelar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Vuelve más tarde, mismo día: "Comenzar" tiene que traerlo de vuelta
        // a ESTA misma sesión con las 2 series ya cargadas, no una vacía --
        // este es el pedido explícito: continuar donde lo dejó.
        // Esta línea sirve para iniciar de nuevo el mismo día.
        $resumed = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para exigir que sea la misma sesión.
        $this->assertSame($session['id'], $resumed['id']);
        // Esta línea sirve para exigir que ya no figure como cancelada.
        $this->assertFalse($resumed['cancelled']);
        // Esta línea sirve para exigir que conserve las 2 series.
        $this->assertCount(2, $resumed['exercises'][0]['sets']);
        // Esta línea sirve para exigir que la tabla workout_sessions tenga 1 registros.
        $this->assertDatabaseCount('workout_sessions', 1);
        // Esta línea sirve para exigir que la tabla workout_sets tenga 2 registros.
        $this->assertDatabaseCount('workout_sets', 2);

        // Y puede terminar la tercera serie y completar con normalidad.
        // Esta línea sirve para registrar la tercera serie.
        $client->postJson("/api/v1/workout-sessions/{$resumed['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 9])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$resumed['id']}/complete")->assertOk()
            // Esta línea sirve para exigir que "data.completed" sea true.
            ->assertJsonPath('data.completed', true);
    }

    // Esta línea sirve para declarar el test que comprueba que el cliente no puede influir en el bloqueo enviando campos extra.
    public function test_the_client_cannot_influence_the_lock_by_sending_extra_fields(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear la rutina de dos días.
        [, $dayA] = $this->makeTwoDayRoutine($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // StartWorkoutSessionRequest no valida ningún campo de fecha -- pasar
        // uno no declarado no tiene ningún efecto, la fecha siempre sale de
        // now() del servidor.
        // Esta línea sirve para intentar iniciar un entrenamiento enviando campos extra.
        $response = $client->postJson('/api/v1/workout-sessions', [
            // Esta línea sirve para asignar $dayA->id al campo "routine_day_id".
            'routine_day_id' => $dayA->id,
            // Esta línea sirve para asignar '2099-01-01' al campo "performed_at".
            'performed_at' => '2099-01-01',
            // Esta línea sirve para asignar false al campo "locked".
            'locked' => false,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.performed_at" sea exactamente now()->toDateString().
        $this->assertSame(now()->toDateString(), $response->json('data.performed_at'));
    }
}
