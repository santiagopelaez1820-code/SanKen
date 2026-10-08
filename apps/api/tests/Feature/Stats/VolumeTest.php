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

// Esta línea sirve para declarar la clase de tests VolumeTest.
class VolumeTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que registra una serie completada.
    private function logCompletedSetFor(mixed $client, string $exerciseName, float $weight, int $reps): int
    {
        // Esta línea sirve para obtener el id del ejercicio por nombre.
        $exerciseId = Exercise::query()->where('name', $exerciseName)->value('id');
        // Esta línea sirve para iniciar un entrenamiento libre.
        $session = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        // Esta línea sirve para agregar el ejercicio a la sesión.
        $workoutExercise = $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises", [
            // Esta línea sirve para asignar $exerciseId al campo "exercise_id".
            'exercise_id' => $exerciseId,
            // Esta línea sirve para obtener los datos del ejercicio de la sesión.
        ])->json('data');

        // Esta línea sirve para registrar una serie.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$workoutExercise['id']}/sets", [
            // Esta línea sirve para enviar peso y repeticiones.
            'weight_kg' => $weight, 'reps' => $reps,
        ]);
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        // Esta línea sirve para devolver el id de la sesión.
        return $session['id'];
    }

    // Esta línea sirve para declarar el test que comprueba que el volumen se agrupa por grupo muscular.
    public function test_volume_is_grouped_by_muscle_group(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar una serie de pecho de 100 kg x 10.
        $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        // Esta línea sirve para registrar una serie de espalda de 50 kg x 10.
        $this->logCompletedSetFor($client, 'Remo con barra', 50, 10);

        // Esta línea sirve para pedir el volumen.
        $response = $client->getJson('/api/v1/stats/volume');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta contenga este fragmento.
        $response->assertJsonFragment(['muscle_group' => 'Pecho', 'volume_kg' => 1000.0]);
        // Esta línea sirve para exigir que la respuesta contenga este fragmento.
        $response->assertJsonFragment(['muscle_group' => 'Espalda', 'volume_kg' => 500.0]);
    }

    // Esta línea sirve para declarar el test que comprueba que el rango semanal excluye sesiones de más de siete días.
    public function test_weekly_range_excludes_sessions_older_than_seven_days(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar una serie de pecho de 100 kg x 10.
        $sessionId = $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        // Esta línea sirve para mover la sesión a hace 10 días.
        WorkoutSession::query()->where('id', $sessionId)->update(['performed_at' => now()->subDays(10)]);

        // Esta línea sirve para pedir el volumen semanal.
        $response = $client->getJson('/api/v1/stats/volume?range=weekly');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $response->assertJsonCount(0, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que el rango mensual incluye una sesión de hace diez días.
    public function test_monthly_range_includes_a_ten_day_old_session(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar una serie de pecho de 100 kg x 10.
        $sessionId = $this->logCompletedSetFor($client, 'Press banca con barra', 100, 10);
        // Esta línea sirve para mover la sesión a hace 10 días.
        WorkoutSession::query()->where('id', $sessionId)->update(['performed_at' => now()->subDays(10)]);

        // Esta línea sirve para pedir el volumen mensual.
        $response = $client->getJson('/api/v1/stats/volume?range=monthly');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta contenga este fragmento.
        $response->assertJsonFragment(['muscle_group' => 'Pecho', 'volume_kg' => 1000.0]);
    }

    // Esta línea sirve para declarar el test que comprueba que un rango inválido se rechaza.
    public function test_invalid_range_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/stats/volume?range=yearly.
            ->getJson('/api/v1/stats/volume?range=yearly')
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }
}
