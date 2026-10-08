<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Gamification.

namespace Tests\Feature\Gamification;

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
// Esta línea sirve para importar la clase AchievementSeeder.
use Database\Seeders\AchievementSeeder;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Carbon.
use Illuminate\Support\Carbon;
// Esta línea sirve para importar la clase TestResponse.
use Illuminate\Testing\TestResponse;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests XpAwardTest.
class XpAwardTest extends TestCase
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

    // Esta línea sirve para declarar el método auxiliar que inicia y completa una sesión.
    private function completeASession(TestCase $client, RoutineDay $day): TestResponse
    {
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');

        // Esta línea sirve para completar el entrenamiento y devolver la respuesta.
        return $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);
    }

    // Esta línea sirve para declarar el test que comprueba que el primer entrenamiento otorga XP base y desbloquea el primer logro.
    public function test_completing_the_first_workout_awards_base_xp_and_unlocks_first_workout_achievement(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para completar una sesión.
        $response = $this->completeASession($client, $day);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "meta.gamification.xp_awarded" sea exactamente 20 + 50.
        $this->assertSame(20 + 50, $response->json('meta.gamification.xp_awarded'));
        // Esta línea sirve para exigir que el único logro desbloqueado sea "first_workout".
        $this->assertSame(['first_workout'], array_column($response->json('meta.gamification.achievements_unlocked'), 'code'));
        // Esta línea sirve para exigir que la tabla user_xp tenga ese registro.
        $this->assertDatabaseHas('user_xp', ['user_id' => $user->id, 'total_xp' => 70]);
        // Esta línea sirve para exigir que la tabla user_achievements tenga ese registro.
        $this->assertDatabaseHas('user_achievements', ['user_id' => $user->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que la décima sesión desbloquea el logro de constancia.
    public function test_completing_the_tenth_session_unlocks_consistent_achievement(): void
    {
        // Una sesión por día calendario: con el desbloqueo diario, completar
        // el mismo routine_day_id dos veces el mismo día ya está bloqueado
        // por el backend (ver DailyLockTest) -- 10 sesiones reales de este
        // split necesariamente caen en 10 días distintos. Se saltea de a 2
        // días (no día seguido) a propósito: este test mide únicamente el
        // logro "consistent" (10 sesiones) -- entrenar 7+ días *seguidos*
        // dispararía además "streak_7" (+100 XP) y rompería el total
        // esperado, que es un logro distinto sin relación con este test.
        // Esta línea sirve para fijar la fecha actual en 2026-01-01 08:00:00.
        Carbon::setTestNow(Carbon::parse('2026-01-01 08:00:00'));

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para repetir 9 veces.
        for ($i = 0; $i < 9; $i++) {
            // Esta línea sirve para completar una sesión y exigir 200.
            $this->completeASession($client, $day)->assertOk();
            // Esta línea sirve para avanzar la fecha 2 días.
            Carbon::setTestNow(Carbon::now()->addDays(2));
        }

        // Esta línea sirve para completar la décima sesión.
        $response = $this->completeASession($client, $day);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "meta.gamification.xp_awarded" sea exactamente 20 + 100.
        $this->assertSame(20 + 100, $response->json('meta.gamification.xp_awarded'));
        // Esta línea sirve para exigir que el único logro desbloqueado sea "consistent".
        $this->assertSame(['consistent'], array_column($response->json('meta.gamification.achievements_unlocked'), 'code'));
        // 10 sesiones x 20 base + 50 (first_workout) + 100 (consistent).
        // Esta línea sirve para exigir que la tabla user_xp tenga ese registro.
        $this->assertDatabaseHas('user_xp', ['user_id' => $user->id, 'total_xp' => 200 + 50 + 100]);

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }
}
