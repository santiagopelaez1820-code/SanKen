<?php

namespace Tests\Feature\Workout;

use App\Models\Exercise;
use App\Models\Routine;
use App\Models\RoutineExercise;
use App\Models\User;
use App\Models\WorkoutSession;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

/**
 * Desbloqueo diario: completar (o saltar) el entrenamiento de hoy bloquea el
 * siguiente día de rutina hasta las 00:00 (UTC, ver DetermineDailyLockStatusAction)
 * del día calendario siguiente. La autoridad es siempre now() del servidor.
 */
class DailyLockTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    /** @return array{0: Routine, 1: object, 2: object} [$routine, $dayA, $dayB] */
    private function makeTwoDayRoutine(User $user): array
    {
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 2, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $dayA = $routine->days()->create(['day_order' => 1, 'label' => 'A', 'target_muscle_groups' => []]);
        $dayB = $routine->days()->create(['day_order' => 2, 'label' => 'B', 'target_muscle_groups' => []]);

        return [$routine, $dayA, $dayB];
    }

    public function test_daily_lock_is_unlocked_when_nothing_was_completed_yet(): void
    {
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $active = $client->getJson('/api/v1/routines/active')->json();

        $this->assertFalse($active['meta']['daily_lock']['locked']);
        $this->assertNull($active['meta']['daily_lock']['unlocks_at']);
        $this->assertSame($dayA->id, $active['meta']['next_day_id']);
    }

    public function test_completing_todays_workout_locks_the_next_one_immediately(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-16 20:30:00'));
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        $active = $client->getJson('/api/v1/routines/active')->json();

        $this->assertTrue($active['meta']['daily_lock']['locked']);
        $this->assertSame('completed', $active['meta']['daily_lock']['reason']);
        // 20:30 -> bloqueado hasta las 00:00 del día calendario siguiente, no
        // "24 horas después" (eso serían las 20:30 del día siguiente).
        $this->assertSame('2026-09-17T00:00:00+00:00', $active['meta']['daily_lock']['unlocks_at']);
    }

    public function test_starting_the_next_days_session_is_rejected_by_the_backend_while_locked(): void
    {
        $user = User::factory()->create();
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // next_day_id ya rotó a dayB (eso no cambia, ver WorkoutSessionTest),
        // pero el backend igual tiene que rechazar arrancarlo hoy -- este es
        // el guardrail real, no la UI.
        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertSame($dayB->id, $active['meta']['next_day_id']);

        $response = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayB->id]);

        $response->assertStatus(422);
        $this->assertStringContainsString('00:00', $response->json('errors.routine_day_id.0'));
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    public function test_skipping_todays_workout_also_locks_and_a_second_skip_is_rejected(): void
    {
        $user = User::factory()->create();
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayA->id])->assertCreated();

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertTrue($active['meta']['daily_lock']['locked']);
        $this->assertSame('skipped', $active['meta']['daily_lock']['reason']);

        // Sin este guardrail, saltar repetidas veces sería la forma de
        // saltarse el bloqueo diario avanzando un día por request.
        $client->postJson('/api/v1/workout-sessions/skip', ['routine_day_id' => $dayB->id])
            ->assertStatus(422);
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    public function test_free_sessions_without_a_routine_day_are_not_gated_by_the_daily_lock(): void
    {
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Una sesión libre no es "el próximo día del programa" -- no está
        // sujeta al desbloqueo diario (alcance documentado en el resumen).
        $client->postJson('/api/v1/workout-sessions', [])->assertCreated();
    }

    public function test_still_locked_one_second_before_midnight(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-16 23:50:00'));
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        // Entrenar tarde a la noche no debería dar horas de espera de más: el
        // desbloqueo sigue siendo a las 00:00, solo 10 minutos después.
        Carbon::setTestNow(Carbon::parse('2026-09-16 23:59:59'));
        $stillLocked = $client->getJson('/api/v1/routines/active')->json();
        $this->assertTrue($stillLocked['meta']['daily_lock']['locked']);
    }

    public function test_unlocks_exactly_at_midnight_of_the_next_calendar_day(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-16 08:00:00'));
        $user = User::factory()->create();
        [, $dayA, $dayB] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete")->assertOk();

        Carbon::setTestNow(Carbon::parse('2026-09-17 00:00:00'));

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertFalse($active['meta']['daily_lock']['locked']);

        // Y el backend ahora sí deja arrancar el día siguiente -- no hace
        // falta reinstalar la app ni borrar caché, el estado es 100% server-side.
        $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayB->id])
            ->assertCreated();
    }

    public function test_a_completed_session_from_a_previous_day_does_not_lock_today(): void
    {
        $user = User::factory()->create();
        [$routine, $dayA] = $this->makeTwoDayRoutine($user);

        // Sesión histórica (usuario/dato ya existente antes de esta feature)
        // de ayer -- no debe afectar el estado de hoy.
        WorkoutSession::query()->create([
            'user_id' => $user->id,
            'routine_day_id' => $dayA->id,
            'performed_at' => now()->subDay()->toDateString(),
            'completed' => true,
        ]);

        $client = $this->actingAs($user, 'sanctum');
        $active = $client->getJson('/api/v1/routines/active')->json();

        $this->assertFalse($active['meta']['daily_lock']['locked']);
    }

    public function test_a_cancelled_session_today_does_not_lock_the_next_one(): void
    {
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        $active = $client->getJson('/api/v1/routines/active')->json();
        $this->assertFalse($active['meta']['daily_lock']['locked']);

        // Al no haber quedado bloqueado, el mismo día de rutina se puede
        // volver a intentar -- y retoma la MISMA sesión (ver
        // test_cancelling_and_restarting_the_same_day_resumes_the_same_session_with_progress_intact),
        // no crea una segunda.
        $resumed = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayA->id])->json('data');
        $this->assertSame($session['id'], $resumed['id']);
        $this->assertDatabaseCount('workout_sessions', 1);
    }

    public function test_cancelling_and_restarting_the_same_day_resumes_the_same_session_with_progress_intact(): void
    {
        $user = User::factory()->create();
        $routine = Routine::query()->create([
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            'split_type' => 'full_body', 'frequency_days' => 1, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        $day = $routine->days()->create(['day_order' => 1, 'label' => 'Full Body', 'target_muscle_groups' => []]);
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        RoutineExercise::query()->create([
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);
        $client = $this->actingAs($user, 'sanctum');

        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        $workoutExerciseId = $session['exercises'][0]['id'];

        // El usuario registra 2 de las 3 series pedidas...
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 10])->assertCreated();
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 9])->assertCreated();

        // ...y sale sin terminar (cancela desde la pantalla de entrenamiento).
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/cancel")->assertOk();

        // Vuelve más tarde, mismo día: "Comenzar" tiene que traerlo de vuelta
        // a ESTA misma sesión con las 2 series ya cargadas, no una vacía --
        // este es el pedido explícito: continuar donde lo dejó.
        $resumed = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        $this->assertSame($session['id'], $resumed['id']);
        $this->assertFalse($resumed['cancelled']);
        $this->assertCount(2, $resumed['exercises'][0]['sets']);
        $this->assertDatabaseCount('workout_sessions', 1);
        $this->assertDatabaseCount('workout_sets', 2);

        // Y puede terminar la tercera serie y completar con normalidad.
        $client->postJson("/api/v1/workout-sessions/{$resumed['id']}/exercises/{$workoutExerciseId}/sets", ['weight_kg' => 80, 'reps' => 9])
            ->assertCreated();
        $client->postJson("/api/v1/workout-sessions/{$resumed['id']}/complete")->assertOk()
            ->assertJsonPath('data.completed', true);
    }

    public function test_the_client_cannot_influence_the_lock_by_sending_extra_fields(): void
    {
        $user = User::factory()->create();
        [, $dayA] = $this->makeTwoDayRoutine($user);
        $client = $this->actingAs($user, 'sanctum');

        // StartWorkoutSessionRequest no valida ningún campo de fecha -- pasar
        // uno no declarado no tiene ningún efecto, la fecha siempre sale de
        // now() del servidor.
        $response = $client->postJson('/api/v1/workout-sessions', [
            'routine_day_id' => $dayA->id,
            'performed_at' => '2099-01-01',
            'locked' => false,
        ]);

        $response->assertCreated();
        $this->assertSame(now()->toDateString(), $response->json('data.performed_at'));
    }
}
