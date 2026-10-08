<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutExercise.
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar el modelo WorkoutSet.
use App\Models\WorkoutSet;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests RateLimitingTest.
class RateLimitingTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que el límite de escrituras responde 429 al superar el umbral.
    public function test_writes_limiter_returns_429_after_the_threshold(): void
    {
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una sesión de entrenamiento.
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now()]);
        // Esta línea sirve para crear un ejercicio de la sesión.
        $exercise = WorkoutExercise::query()->create([
            // Esta línea sirve para asignar $session->id al campo "workout_session_id".
            'workout_session_id' => $session->id,
            // Esta línea sirve para asignar Exercise::query()->first()->id al campo "exercise_id".
            'exercise_id' => Exercise::query()->first()->id,
            // Esta línea sirve para asignar 1 al campo "order".
            'order' => 1,
        ]);
        // Esta línea sirve para crear una serie.
        $set = WorkoutSet::query()->create([
            // Esta línea sirve para asignar $exercise->id al campo "workout_exercise_id".
            'workout_exercise_id' => $exercise->id,
            // Esta línea sirve para asignar 1 al campo "set_number".
            'set_number' => 1,
            // Esta línea sirve para asignar 50 al campo "weight_kg".
            'weight_kg' => 50,
            // Esta línea sirve para asignar 10 al campo "reps".
            'reps' => 10,
        ]);

        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para repetir 30 veces.
        for ($i = 0; $i < 30; $i++) {
            // Esta línea sirve para editar la serie y exigir 200.
            $client->patchJson("/api/v1/workout-sets/{$set->id}", ['weight_kg' => 50 + $i])->assertOk();
        }

        // Esta línea sirve para hacer la edición 31 y exigir 429.
        $client->patchJson("/api/v1/workout-sets/{$set->id}", ['weight_kg' => 999])->assertStatus(429);
    }

    // Esta línea sirve para declarar el test que comprueba que las rutas de solo lectura no tienen el límite de escrituras.
    public function test_read_only_routes_are_not_restricted_by_the_writes_limiter(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para repetir 35 veces.
        for ($i = 0; $i < 35; $i++) {
            // Esta línea sirve para pedir los ejercicios y exigir 200.
            $client->getJson('/api/v1/exercises')->assertOk();
        }
    }
}
