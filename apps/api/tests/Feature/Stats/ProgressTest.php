<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Stats.

namespace Tests\Feature\Stats;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ProgressTest.
class ProgressTest extends TestCase
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

    // Esta línea sirve para declarar el test que comprueba que la métrica es obligatoria.
    public function test_metric_is_required(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir la evolución sin métrica y exigir 422.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/progress')->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que el ejercicio es obligatorio para la métrica 1RM.
    public function test_exercise_id_is_required_for_the_1rm_metric(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/stats/progress?metric=1rm.
            ->getJson('/api/v1/stats/progress?metric=1rm')
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que la métrica de peso devuelve el historial de medidas corporales.
    public function test_weight_metric_returns_the_body_measurement_history(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para registrar una medida de 82,4 kg del 1 de julio.
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 82.4, 'measured_at' => '2026-07-01']);
        // Esta línea sirve para registrar una medida de 80,1 kg del 1 de agosto.
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 80.1, 'measured_at' => '2026-08-01']);

        // Esta línea sirve para pedir la evolución del peso.
        $response = $client->getJson('/api/v1/stats/progress?metric=weight');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.0.date" sea '2026-07-01'.
        $response->assertJsonPath('data.0.date', '2026-07-01');
        // Esta línea sirve para exigir que "data.0.value" sea 82.4.
        $response->assertJsonPath('data.0.value', 82.4);
        // Esta línea sirve para exigir que "data.1.date" sea '2026-08-01'.
        $response->assertJsonPath('data.1.date', '2026-08-01');
        // Esta línea sirve para exigir que "data.1.value" sea 80.1.
        $response->assertJsonPath('data.1.value', 80.1);
    }

    // Esta línea sirve para declarar el test que comprueba que la métrica 1RM devuelve el 1RM estimado por sesión del ejercicio.
    public function test_1rm_metric_returns_estimated_1rm_per_session_for_the_exercise(): void
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
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        // Esta línea sirve para pedir la evolución del 1RM del ejercicio.
        $response = $client->getJson("/api/v1/stats/progress?metric=1rm&exercise_id={$exerciseId}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Epley: 100 * (1 + 10/30) = 133.33
        // Esta línea sirve para exigir que "data.0.value" sea 133.33.
        $response->assertJsonPath('data.0.value', 133.33);
    }

    // Esta línea sirve para declarar el test que comprueba que la métrica de volumen devuelve el historial diario.
    public function test_volume_metric_returns_the_daily_aggregate_history(): void
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
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        // Esta línea sirve para pedir la evolución del volumen.
        $response = $client->getJson('/api/v1/stats/progress?metric=volume');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.0.date" sea now()->toDateString().
        $response->assertJsonPath('data.0.date', now()->toDateString());
        // Esta línea sirve para exigir que el primer valor sea 1000.
        $this->assertEquals(1000.0, (float) $response->json('data.0.value'));
    }
}
