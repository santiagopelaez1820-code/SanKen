<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Challenges.

namespace Tests\Feature\Challenges;

// Esta línea sirve para importar la clase ChallengeCatalog.
use App\Domain\Challenges\Services\ChallengeCatalog;
// Esta línea sirve para importar la clase ChallengeProgressCalculator.
use App\Domain\Challenges\Services\ChallengeProgressCalculator;
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
// Esta línea sirve para importar la clase Carbon.
use Carbon\Carbon;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ChallengeProgressCalculatorTest.
class ChallengeProgressCalculatorTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que registra una sesión completada.
    private function logCompletedSession(User $user, string $date, ?float $weightKg = null, ?int $reps = null): WorkoutSession
    {
        // Esta línea sirve para crear la sesión completada.
        $session = WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y que está completada.
            'user_id' => $user->id, 'performed_at' => $date, 'completed' => true,
        ]);

        // Esta línea sirve para revisar si se indicó un peso.
        if ($weightKg !== null) {
            // Esta línea sirve para crear un ejercicio de la sesión.
            $exercise = WorkoutExercise::query()->create([
                // Esta línea sirve para asignar la sesión, el ejercicio, el orden y las series completadas.
                'workout_session_id' => $session->id, 'exercise_id' => Exercise::query()->value('id'), 'order' => 1, 'all_sets_completed' => true,
            ]);
            // Esta línea sirve para crear una serie.
            WorkoutSet::query()->create([
                // Esta línea sirve para asignar el ejercicio y el número de serie.
                'workout_exercise_id' => $exercise->id, 'set_number' => 1,
                // Esta línea sirve para asignar peso, repeticiones, que no es de calentamiento y que está completada.
                'weight_kg' => $weightKg, 'reps' => $reps, 'is_warmup' => false, 'completed' => true,
            ]);
        }

        // Esta línea sirve para devolver la sesión.
        return $session;
    }

    // Esta línea sirve para declarar el test que comprueba que el conteo de entrenamientos solo incluye sesiones completadas dentro del rango.
    public function test_workouts_count_only_counts_completed_sessions_within_the_range(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar una sesión completada el día 3.
        $this->logCompletedSession($user, '2026-08-03');
        // Esta línea sirve para registrar una sesión completada el día 5.
        $this->logCompletedSession($user, '2026-08-05');
        // Esta línea sirve para crear una sesión no completada el día 6.
        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => '2026-08-06', 'completed' => false]);
        // Esta línea sirve para registrar una sesión completada fuera del rango.
        $this->logCompletedSession($user, '2026-08-20');

        // Esta línea sirve para calcular la métrica de cantidad de entrenamientos.
        $value = (new ChallengeProgressCalculator)->calculate(
            // Esta línea sirve para pasar el usuario y la métrica.
            $user->id, ChallengeCatalog::METRIC_WORKOUTS_COUNT,
            // Esta línea sirve para pasar el rango del 1 al 7 de agosto.
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        // Esta línea sirve para exigir que el resultado sea 2.
        $this->assertSame(2.0, $value);
    }

    // Esta línea sirve para declarar el test que comprueba que el volumen suma peso por repeticiones solo de series de trabajo.
    public function test_total_volume_kg_sums_weight_times_reps_for_working_sets_only(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar una sesión con 100 kg x 10.
        $this->logCompletedSession($user, '2026-08-03', weightKg: 100, reps: 10);
        // Esta línea sirve para registrar una sesión con 50 kg x 8.
        $this->logCompletedSession($user, '2026-08-04', weightKg: 50, reps: 8);
        // Fuera de rango: no debe sumar.
        // Esta línea sirve para registrar una sesión fuera del rango.
        $this->logCompletedSession($user, '2026-08-20', weightKg: 999, reps: 99);

        // Esta línea sirve para calcular la métrica de volumen total.
        $value = (new ChallengeProgressCalculator)->calculate(
            // Esta línea sirve para pasar el usuario y la métrica.
            $user->id, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
            // Esta línea sirve para pasar el rango del 1 al 7 de agosto.
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        // Esta línea sirve para exigir que el resultado sea 1400.
        $this->assertSame(1400.0, $value);
    }

    // Esta línea sirve para declarar el test que comprueba que el volumen ignora series de calentamiento e incompletas.
    public function test_total_volume_kg_ignores_warmup_and_incomplete_sets(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar una sesión completada sin series.
        $session = $this->logCompletedSession($user, '2026-08-03');
        // Esta línea sirve para crear un ejercicio de la sesión.
        $exercise = WorkoutExercise::query()->create([
            // Esta línea sirve para asignar la sesión, el ejercicio, el orden y las series completadas.
            'workout_session_id' => $session->id, 'exercise_id' => Exercise::query()->value('id'), 'order' => 1, 'all_sets_completed' => true,
        ]);
        // Esta línea sirve para crear una serie de calentamiento.
        WorkoutSet::query()->create([
            // Esta línea sirve para asignar el ejercicio y el número de serie.
            'workout_exercise_id' => $exercise->id, 'set_number' => 1,
            // Esta línea sirve para asignar peso, repeticiones, que es de calentamiento y que está completada.
            'weight_kg' => 100, 'reps' => 10, 'is_warmup' => true, 'completed' => true,
        ]);
        // Esta línea sirve para crear una serie incompleta.
        WorkoutSet::query()->create([
            // Esta línea sirve para asignar el ejercicio y el número de serie.
            'workout_exercise_id' => $exercise->id, 'set_number' => 2,
            // Esta línea sirve para asignar peso, repeticiones, que no es de calentamiento y que no está completada.
            'weight_kg' => 100, 'reps' => 10, 'is_warmup' => false, 'completed' => false,
        ]);

        // Esta línea sirve para calcular la métrica de volumen total.
        $value = (new ChallengeProgressCalculator)->calculate(
            // Esta línea sirve para pasar el usuario y la métrica.
            $user->id, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
            // Esta línea sirve para pasar el rango del 1 al 7 de agosto.
            Carbon::parse('2026-08-01'), Carbon::parse('2026-08-07'),
        );

        // Esta línea sirve para exigir que el resultado sea 0.
        $this->assertSame(0.0, $value);
    }
}
