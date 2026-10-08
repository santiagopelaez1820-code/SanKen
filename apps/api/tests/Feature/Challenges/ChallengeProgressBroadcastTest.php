<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Challenges.

namespace Tests\Feature\Challenges;

// Esta línea sirve para importar la clase ChallengeProgressUpdated.
use App\Events\ChallengeProgressUpdated;
// Esta línea sirve para importar el modelo Challenge.
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeParticipant.
use App\Models\ChallengeParticipant;
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
// Esta línea sirve para importar la clase Carbon.
use Carbon\Carbon;
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

// Esta línea sirve para declarar la clase de tests ChallengeProgressBroadcastTest.
class ChallengeProgressBroadcastTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de AchievementSeeder.
        $this->seed(AchievementSeeder::class);
    }

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
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

    // Esta línea sirve para declarar el test que comprueba que completar una sesión actualiza el progreso y emite la tabla nueva.
    public function test_completing_a_session_updates_progress_and_broadcasts_the_new_leaderboard(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([ChallengeProgressUpdated::class]);

        // Esta línea sirve para crear un reto semanal.
        $challenge = Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            // Esta línea sirve para asignar el tipo y los criterios (métrica y meta).
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            // Esta línea sirve para asignar Carbon::now()->startOfWeek()->toDateString() al campo "starts_at".
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            // Esta línea sirve para asignar Carbon::now()->endOfWeek()->toDateString() al campo "ends_at".
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar al usuario como participante con progreso 0.
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 0]);

        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completar el entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        // Esta línea sirve para exigir que la tabla challenge_participants tenga un registro con estos datos.
        $this->assertDatabaseHas('challenge_participants', [
            // Esta línea sirve para asignar el reto, el usuario y el progreso esperado (1).
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 1,
        ]);

        // Esta línea sirve para exigir que se haya emitido el evento de progreso con esta condición.
        Event::assertDispatched(ChallengeProgressUpdated::class, function (ChallengeProgressUpdated $event) use ($challenge, $user) {
            // Esta línea sirve para exigir que sea el mismo reto.
            return $event->challenge->is($challenge)
                // Esta línea sirve para exigir que la tabla incluya al usuario con progreso 1.
                && collect($event->leaderboard)->contains(fn ($entry) => $entry['user_id'] === $user->id && $entry['progress_value'] === 1.0);
        });
    }

    // Esta línea sirve para declarar el test que comprueba que completar una sesión no toca retos a los que el usuario no se unió.
    public function test_completing_a_session_does_not_touch_challenges_the_user_has_not_joined(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([ChallengeProgressUpdated::class]);

        // Esta línea sirve para crear un reto semanal.
        Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            // Esta línea sirve para asignar el tipo y los criterios (métrica y meta).
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            // Esta línea sirve para asignar Carbon::now()->startOfWeek()->toDateString() al campo "starts_at".
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            // Esta línea sirve para asignar Carbon::now()->endOfWeek()->toDateString() al campo "ends_at".
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

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

        // Esta línea sirve para exigir que la tabla challenge_participants tenga 0 registros.
        $this->assertDatabaseCount('challenge_participants', 0);
        // Esta línea sirve para exigir que no se haya disparado el evento ChallengeProgressUpdated.
        Event::assertNotDispatched(ChallengeProgressUpdated::class);
    }

    // Esta línea sirve para declarar el test que comprueba que alcanzar la meta marca al participante como completado.
    public function test_reaching_the_target_marks_the_participant_completed(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([ChallengeProgressUpdated::class]);

        // Esta línea sirve para crear un reto semanal con meta 1.
        $challenge = Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            // Esta línea sirve para asignar el tipo y los criterios (métrica y meta).
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 1],
            // Esta línea sirve para asignar Carbon::now()->startOfWeek()->toDateString() al campo "starts_at".
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            // Esta línea sirve para asignar Carbon::now()->endOfWeek()->toDateString() al campo "ends_at".
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar al usuario como participante con progreso 0.
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 0]);

        // Esta línea sirve para crear un día de rutina con un ejercicio.
        $day = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completar el entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", [])->assertOk();

        // Esta línea sirve para exigir que la tabla challenge_participants tenga un registro con estos datos.
        $this->assertDatabaseHas('challenge_participants', [
            // Esta línea sirve para asignar el reto, el usuario y que quede completado.
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'completed' => true,
        ]);
    }
}
