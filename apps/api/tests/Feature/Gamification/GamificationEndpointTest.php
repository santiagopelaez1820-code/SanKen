<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Gamification.

namespace Tests\Feature\Gamification;

// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineExercise.
use App\Models\RoutineExercise;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase AchievementSeeder.
use Database\Seeders\AchievementSeeder;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests GamificationEndpointTest.
class GamificationEndpointTest extends TestCase
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
        // Esta línea sirve para sembrar los datos de AchievementSeeder.
        $this->seed(AchievementSeeder::class);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario nuevo tiene resumen en cero y todos los logros bloqueados.
    public function test_new_user_gamification_summary_is_zeroed_and_all_achievements_locked(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/gamification autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/gamification');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.total_xp" sea 0.
        $response->assertJsonPath('data.total_xp', 0);
        // Esta línea sirve para exigir que "data.level" sea 1.
        $response->assertJsonPath('data.level', 1);
        // Esta línea sirve para exigir que "data.unlocked_achievements" tenga 0 elementos.
        $response->assertJsonCount(0, 'data.unlocked_achievements');
        // Esta línea sirve para exigir que "data.locked_achievements" tenga 10 elementos.
        $response->assertJsonCount(10, 'data.locked_achievements');
    }

    // Esta línea sirve para declarar el test que comprueba que el endpoint pasa un logro a desbloqueado tras completar un entrenamiento.
    public function test_endpoint_moves_an_achievement_to_unlocked_after_completing_a_workout(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
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
        RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completar el entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        // Esta línea sirve para pedir el resumen de gamificación.
        $response = $client->getJson('/api/v1/gamification');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.unlocked_achievements" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.unlocked_achievements');
        // Esta línea sirve para exigir que "data.locked_achievements" tenga 9 elementos.
        $response->assertJsonCount(9, 'data.locked_achievements');
        // Esta línea sirve para exigir que "data.unlocked_achievements.0.code" sea 'first_workout'.
        $response->assertJsonPath('data.unlocked_achievements.0.code', 'first_workout');
        // Esta línea sirve para exigir que "data.unlocked_achievements.0.achieved_at" no sea null.
        $this->assertNotNull($response->json('data.unlocked_achievements.0.achieved_at'));
        // Esta línea sirve para exigir que "data.locked_achievements.0.achieved_at" sea null.
        $this->assertNull($response->json('data.locked_achievements.0.achieved_at'));
    }
}
