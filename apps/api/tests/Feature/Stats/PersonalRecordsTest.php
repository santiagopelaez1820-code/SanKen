<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Stats.

namespace Tests\Feature\Stats;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
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
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests PersonalRecordsTest.
class PersonalRecordsTest extends TestCase
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

    // Esta línea sirve para declarar el test que comprueba que lista los récords del usuario con el nombre del ejercicio.
    public function test_lists_the_users_personal_records_with_exercise_name(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para iniciar un entrenamiento libre.
        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        // Esta línea sirve para agregar un ejercicio a la sesión.
        $workoutExercise = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            // Esta línea sirve para asignar $exerciseId al campo "exercise_id".
            'exercise_id' => $exerciseId,
            // Esta línea sirve para obtener los datos del ejercicio de la sesión.
        ])->json('data');
        // Esta línea sirve para registrar una serie.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => 100, 'reps' => 10,
        ]);

        // Esta línea sirve para pedir los récords.
        $response = $client->getJson('/api/v1/stats/personal-records');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.exercise_name" sea 'Press banca con barra'.
        $response->assertJsonPath('data.0.exercise_name', 'Press banca con barra');
        // Esta línea sirve para exigir que "data.0.record_type" sea '1rm'.
        $response->assertJsonPath('data.0.record_type', '1rm');
    }

    // Esta línea sirve para declarar el test que comprueba que devuelve una lista vacía si el usuario no tiene récords.
    public function test_returns_an_empty_list_when_the_user_has_no_records(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/stats/personal-records autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/personal-records');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $response->assertJsonCount(0, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que un récord manual no toca las sesiones de entrenamiento.
    public function test_manual_pr_is_created_and_never_touches_workout_sessions(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para hacer POST a /api/v1/stats/personal-records autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/stats/personal-records', [
            // Esta línea sirve para asignar $exerciseId al campo "exercise_id".
            'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar 180 al campo "weight_kg".
            'weight_kg' => 180,
            // Esta línea sirve para asignar 1 al campo "reps".
            'reps' => 1,
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "meta.is_new_best" sea true.
        $response->assertJsonPath('meta.is_new_best', true);
        // Esta línea sirve para exigir que "data.record_type" sea '1rm'.
        $response->assertJsonPath('data.record_type', '1rm');
        // Esta línea sirve para exigir que no se haya creado ninguna sesión.
        $this->assertSame(0, WorkoutSession::query()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que un récord manual solo se reemplaza si es una mejora real.
    public function test_manual_pr_replaces_only_when_it_is_a_genuine_improvement(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para registrar un récord de 180 kg x 1.
        $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 180, 'reps' => 1]);
        // Esta línea sirve para guardar el valor actual.
        $first = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');

        // Esta línea sirve para registrar un récord mejor de 200 kg x 1.
        $better = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 200, 'reps' => 1]);
        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $better->assertCreated();
        // Esta línea sirve para exigir que "meta.is_new_best" sea true.
        $better->assertJsonPath('meta.is_new_best', true);
        // Esta línea sirve para guardar el valor nuevo.
        $improved = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');
        // Esta línea sirve para exigir que el valor haya subido.
        $this->assertGreaterThan($first, $improved);

        // Esta línea sirve para intentar registrar un récord peor de 190 kg x 1.
        $worse = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 190, 'reps' => 1]);
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $worse->assertOk();
        // Esta línea sirve para exigir que "meta.is_new_best" sea false.
        $worse->assertJsonPath('meta.is_new_best', false);
        // Esta línea sirve para guardar el valor actual.
        $unchanged = $client->getJson('/api/v1/stats/personal-records')->json('data.0.value');
        // Esta línea sirve para exigir que no haya cambiado.
        $this->assertSame($improved, $unchanged);

        // Esta línea sirve para exigir que no se haya creado ninguna sesión.
        $this->assertSame(0, WorkoutSession::query()->count());
    }

    /**
     * Reporte del tester: 100 kg × 5 se mostraba como "116.67 kg" (1RM
     * estimado) y después 110 kg × 1 no contaba como récord. El récord es
     * el peso real levantado, y más peso siempre lo supera.
     */
    // Esta línea sirve para declarar el test que comprueba que el récord manual guarda el peso real y uno más pesado siempre lo supera.
    public function test_manual_pr_stores_the_real_weight_and_a_heavier_lift_always_beats_it(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para registrar un récord de 100 kg x 5.
        $first = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 100, 'reps' => 5]);
        // Esta línea sirve para exigir que "data.value" sea 100.
        $first->assertJsonPath('data.value', 100);
        // Esta línea sirve para exigir que "data.reps" sea 5.
        $first->assertJsonPath('data.reps', 5);

        // Esta línea sirve para registrar un récord más pesado de 110 kg x 1.
        $heavier = $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 110, 'reps' => 1]);
        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $heavier->assertCreated();
        // Esta línea sirve para exigir que "meta.is_new_best" sea true.
        $heavier->assertJsonPath('meta.is_new_best', true);
        // Esta línea sirve para exigir que "data.value" sea 110.
        $heavier->assertJsonPath('data.value', 110);
        // Esta línea sirve para exigir que "data.reps" sea 1.
        $heavier->assertJsonPath('data.reps', 1);

        // Esta línea sirve para pedir los récords.
        $client->getJson('/api/v1/stats/personal-records')
            // Esta línea sirve para exigir que "data" tenga 1 elementos.
            ->assertJsonCount(1, 'data')
            // Esta línea sirve para exigir que "data.0.value" sea 110.
            ->assertJsonPath('data.0.value', 110)
            // Esta línea sirve para exigir que "data.0.reps" sea 1.
            ->assertJsonPath('data.0.reps', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que con el mismo peso solo gana quien hace más repeticiones.
    public function test_manual_pr_with_same_weight_only_wins_with_more_reps(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $exerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');

        // Esta línea sirve para registrar un récord de 100 kg x 3.
        $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 100, 'reps' => 3]);

        // Esta línea sirve para intentar registrar 100 kg x 2.
        $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 100, 'reps' => 2])
            // Esta línea sirve para exigir que "meta.is_new_best" sea false.
            ->assertJsonPath('meta.is_new_best', false)
            // Esta línea sirve para exigir que "data.reps" sea 3.
            ->assertJsonPath('data.reps', 3);

        // Esta línea sirve para registrar 100 kg x 4.
        $client->postJson('/api/v1/stats/personal-records', ['exercise_id' => $exerciseId, 'weight_kg' => 100, 'reps' => 4])
            // Esta línea sirve para exigir que "meta.is_new_best" sea true.
            ->assertJsonPath('meta.is_new_best', true)
            // Esta línea sirve para exigir que "data.reps" sea 4.
            ->assertJsonPath('data.reps', 4);
    }
}
