<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Gamification.

namespace Tests\Feature\Gamification;

// Esta línea sirve para importar la acción AggregateDailyStatsAction.
use App\Application\Stats\Actions\AggregateDailyStatsAction;
// Esta línea sirve para importar la clase PRBroken.
use App\Events\PRBroken;
// Esta línea sirve para importar la clase StreakMilestone.
use App\Events\StreakMilestone;
// Esta línea sirve para importar la clase WorkoutCompleted.
use App\Events\WorkoutCompleted;
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
// Esta línea sirve para importar la fachada Event.
use Illuminate\Support\Facades\Event;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests EventDispatchTest.
class EventDispatchTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que crea un día de rutina con un ejercicio.
    private function makeRoutineDayWithOneExercise(User $user): RoutineDay
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
        RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        // Esta línea sirve para devolver el día con sus ejercicios.
        return $day->load('exercises');
    }

    // Esta línea sirve para declarar el test que comprueba que completar una sesión dispara el evento de entrenamiento completado.
    public function test_completing_a_session_dispatches_workout_completed(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([WorkoutCompleted::class]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completar el entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        // Esta línea sirve para exigir que se haya disparado el evento para este usuario.
        Event::assertDispatched(WorkoutCompleted::class, fn ($event) => $event->user->is($user));
    }

    // Esta línea sirve para declarar el test que comprueba que un récord nuevo dispara el evento de PR superado.
    public function test_a_new_personal_record_dispatches_pr_broken(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([PRBroken::class]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        // Esta línea sirve para exigir que se haya disparado el evento para este usuario.
        Event::assertDispatched(PRBroken::class, fn ($event) => $event->user->is($user));
    }

    // Esta línea sirve para declarar el test que comprueba que cruzar el umbral de racha dispara el evento una sola vez.
    public function test_crossing_a_streak_threshold_dispatches_streak_milestone_exactly_once(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([StreakMilestone::class]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para repetir 7 veces.
        for ($i = 0; $i < 7; $i++) {
            // Esta línea sirve para calcular la fecha de cada día de la racha.
            $date = now()->subDays(6 - $i)->toDateString();
            // Esta línea sirve para registrar una sesión completada ese día.
            WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $date, 'completed' => true]);
            // Esta línea sirve para agregar las estadísticas diarias de ese día.
            AggregateDailyStatsAction::dispatchSync($user, $date);
        }

        // Esta línea sirve para exigir que el evento se haya disparado una sola vez.
        Event::assertDispatchedTimes(StreakMilestone::class, 1);
        // Esta línea sirve para exigir que sea para este usuario con 7 días de racha.
        Event::assertDispatched(StreakMilestone::class, fn ($event) => $event->user->is($user) && $event->streakDays === 7);

        // Un día más con la racha viva (8) no vuelve a cruzar el umbral de 7.
        // Esta línea sirve para calcular la fecha del octavo día.
        $eighthDate = now()->toDateString();
        // Esta línea sirve para registrar una sesión completada ese día.
        WorkoutSession::query()->create(['user_id' => $user->id, 'performed_at' => $eighthDate, 'completed' => true]);
        // Esta línea sirve para agregar las estadísticas diarias de ese día.
        AggregateDailyStatsAction::dispatchSync($user, $eighthDate);

        // Esta línea sirve para exigir que el evento siga disparado una sola vez.
        Event::assertDispatchedTimes(StreakMilestone::class, 1);
    }
}
