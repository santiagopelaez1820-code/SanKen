<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Gamification.

namespace Tests\Feature\Gamification;

// Esta línea sirve para importar la acción AggregateDailyStatsAction.
use App\Application\Stats\Actions\AggregateDailyStatsAction;
// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo PersonalRecord.
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo UserAchievement.
use App\Models\UserAchievement;
// Esta línea sirve para importar el modelo WorkoutExercise.
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
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

// Esta línea sirve para declarar la clase de tests PrAndStreakAchievementsTest.
class PrAndStreakAchievementsTest extends TestCase
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

    // Esta línea sirve para declarar el test que comprueba que los logros de PR se desbloquean con 1, 10 y 25 récords sin duplicarse.
    public function test_pr_achievements_unlock_at_1_10_and_25_records_and_never_duplicate(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para crear una sesión no completada.
        $session = WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => now(), 'completed' => false]);
        // Esta línea sirve para obtener los ids de 25 ejercicios.
        $exerciseIds = Exercise::query()->orderBy('id')->limit(25)->pluck('id');

        // Esta línea sirve para guardar el orden en que se desbloquean los logros.
        $unlockedCodesInOrder = [];
        // Esta línea sirve para recorrer cada ejercicio.
        foreach ($exerciseIds as $exerciseId) {
            // Esta línea sirve para crear el ejercicio de la sesión.
            $workoutExercise = WorkoutExercise::query()->create([
                // Esta línea sirve para asignar la sesión, el ejercicio y el orden.
                'workout_session_id' => $session->id, 'exercise_id' => $exerciseId, 'order' => 1,
            ]);

            // Esta línea sirve para registrar una serie (cada ejercicio nuevo es un récord).
            $response = $client->postJson(
                // Esta línea sirve para indicar la ruta de las series.
                "/api/v1/workout-sessions/{$session->id}/exercises/{$workoutExercise->id}/sets",
                // Esta línea sirve para enviar peso y repeticiones.
                ['weight_kg' => 100, 'reps' => 10],
            );
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            $response->assertCreated();
        }

        // Esta línea sirve para exigir que la tabla personal_records tenga ese registro.
        $this->assertDatabaseHas('personal_records', ['user_id' => $user->id]);
        // Esta línea sirve para exigir que haya 25 récords personales.
        $this->assertSame(25, PersonalRecord::query()->where('user_id', $user->id)->count());

        // Esta línea sirve para recorrer los códigos de logro esperados.
        foreach (['pr_first', 'pr_10', 'pr_25'] as $code) {
            // Esta línea sirve para exigir exactamente.
            $this->assertSame(
                // Esta línea sirve para indicar el valor esperado (1).
                1,
                // Esta línea sirve para consultar los logros de los usuarios.
                UserAchievement::query()
                    // Esta línea sirve para filtrar por el código del logro.
                    ->whereHas('achievement', fn ($q) => $q->where('code', $code))
                    // Esta línea sirve para filtrar por user_id.
                    ->where('user_id', $user->id)
                    // Esta línea sirve para contar los registros.
                    ->count(),
                // Esta línea sirve para mostrar este mensaje si falla.
                "El logro {$code} debería haberse otorgado exactamente una vez.",
            );
        }
    }

    // Esta línea sirve para declarar el test que comprueba que los logros de racha se desbloquean a los 7, 30 y 100 días.
    public function test_streak_achievements_unlock_at_7_30_and_100_days(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para repetir 100 veces.
        for ($i = 0; $i < 100; $i++) {
            // Esta línea sirve para calcular la fecha de cada día de la racha.
            $date = now()->subDays(99 - $i)->toDateString();
            // Esta línea sirve para registrar una sesión completada ese día.
            WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $date, 'completed' => true]);
            // Esta línea sirve para agregar las estadísticas diarias de ese día.
            AggregateDailyStatsAction::dispatchSync($user, $date);
        }

        // Esta línea sirve para recorrer los códigos de logro de racha esperados.
        foreach (['streak_7', 'streak_30', 'streak_100'] as $code) {
            // Esta línea sirve para exigir exactamente.
            $this->assertSame(
                // Esta línea sirve para indicar el valor esperado (1).
                1,
                // Esta línea sirve para consultar los logros de los usuarios.
                UserAchievement::query()
                    // Esta línea sirve para filtrar por el código del logro.
                    ->whereHas('achievement', fn ($q) => $q->where('code', $code))
                    // Esta línea sirve para filtrar por user_id.
                    ->where('user_id', $user->id)
                    // Esta línea sirve para contar los registros.
                    ->count(),
                // Esta línea sirve para mostrar este mensaje si falla.
                "El logro {$code} debería haberse otorgado exactamente una vez.",
            );
        }
    }
}
