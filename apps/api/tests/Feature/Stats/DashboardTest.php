<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Stats.

namespace Tests\Feature\Stats;

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
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada DB.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests DashboardTest.
class DashboardTest extends TestCase
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

    /**
     * @return array{0: RoutineDay, 1: RoutineExercise}
     */
    // Esta línea sirve para declarar el método auxiliar que crea un día de rutina con un ejercicio.
    private function makeRoutineDayWithOneExercise(User $user): array
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
        $routineExercise = RoutineExercise::query()->create([
            // Esta línea sirve para asignar el día, el ejercicio y el orden.
            'routine_day_id' => $day->id, 'exercise_id' => $exerciseId, 'order' => 1,
            // Esta línea sirve para asignar series, repeticiones, descanso y RPE objetivo.
            'target_sets' => 3, 'target_reps' => '8-10', 'rest_seconds' => 90, 'target_rpe' => 8.0,
        ]);

        // Esta línea sirve para devolver el día y su ejercicio.
        return [$day->load('exercises'), $routineExercise];
    }

    // Esta línea sirve para declarar el test que comprueba que el dashboard está en cero para un usuario nuevo.
    public function test_dashboard_is_zeroed_out_for_a_new_user(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/stats/dashboard autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/stats/dashboard');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta tenga estos valores.
        $response->assertJson([
            // Esta línea sirve para incluir los datos en cero.
            'data' => [
                // Esta línea sirve para asignar 0 al campo "total_hours".
                'total_hours' => 0,
                // Esta línea sirve para asignar 0 al campo "total_sets".
                'total_sets' => 0,
                // Esta línea sirve para asignar 0 al campo "total_volume_kg".
                'total_volume_kg' => 0,
                // Esta línea sirve para asignar 0 al campo "current_streak_days".
                'current_streak_days' => 0,
                // Esta línea sirve para asignar 0 al campo "total_workouts".
                'total_workouts' => 0,
                // Esta línea sirve para asignar 0 al campo "completed_challenges".
                'completed_challenges' => 0,
                // Esta línea sirve para asignar [] al campo "recent_personal_records".
                'recent_personal_records' => [],
            ],
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que completar una sesión actualiza los totales del dashboard.
    public function test_completing_a_session_updates_the_dashboard_totals(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id del ejercicio de la sesión.
        $weId = $session['exercises'][0]['id'];

        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para registrar otra serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para registrar una serie de calentamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", [
            // Esta línea sirve para enviar peso, repeticiones y marcarla como calentamiento.
            'weight_kg' => 50, 'reps' => 5, 'is_warmup' => true,
        ]);

        // Esta línea sirve para completar el entrenamiento con 45 minutos.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", ['duration_minutes' => 45]);

        // Esta línea sirve para pedir el dashboard.
        $response = $client->getJson('/api/v1/stats/dashboard');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // 2 series de trabajo (la warmup no cuenta), 100kg x 10 reps x 2 = 2000kg de volumen.
        // Esta línea sirve para exigir que "data.total_sets" sea 2.
        $response->assertJsonPath('data.total_sets', 2);
        // Esta línea sirve para exigir que el volumen sea 2000 kg (el calentamiento no cuenta).
        $this->assertEquals(2000.0, (float) $response->json('data.total_volume_kg'));
        // Esta línea sirve para exigir que las horas sean 0,8.
        $this->assertEquals(0.8, (float) $response->json('data.total_hours'));
        // Esta línea sirve para exigir que "data.current_streak_days" sea 1.
        $response->assertJsonPath('data.current_streak_days', 1);
        // Esta línea sirve para exigir que "data.recent_personal_records" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.recent_personal_records');
    }

    // Esta línea sirve para declarar el test que comprueba que una segunda sesión el mismo día actualiza la misma fila de estadísticas.
    public function test_completing_a_second_session_the_same_day_updates_the_same_stats_row_instead_of_duplicating_it(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para iniciar el primer entrenamiento.
        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id de su ejercicio.
        $weId1 = $session1['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/exercises/{$weId1}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para completar el primer entrenamiento y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/complete", [])->assertOk();

        // Esta línea sirve para iniciar un entrenamiento libre.
        $session2 = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session2['id']}/complete", [])->assertOk();

        // Esta línea sirve para exigir que la tabla user_stats_daily tenga 1 registros.
        $this->assertDatabaseCount('user_stats_daily', 1);
        // Esta línea sirve para pedir el dashboard.
        $response = $client->getJson('/api/v1/stats/dashboard');
        // Esta línea sirve para exigir que "data.total_sets" sea 1.
        $response->assertJsonPath('data.total_sets', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que el dashboard cuenta entrenamientos y retos completados de toda la historia.
    public function test_dashboard_counts_lifetime_completed_workouts_and_challenges(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Dos sesiones completadas el mismo día -- total_workouts cuenta
        // sesiones, no fechas únicas (a diferencia de current_streak_days,
        // que en este caso seguiría dando 1).
        // Esta línea sirve para iniciar el primer entrenamiento.
        $session1 = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session1['id']}/complete", [])->assertOk();
        // Esta línea sirve para iniciar un entrenamiento libre.
        $session2 = $client->postJson('/api/v1/workout-sessions', [])->json('data');
        // Esta línea sirve para completarlo y exigir 200.
        $client->postJson("/api/v1/workout-sessions/{$session2['id']}/complete", [])->assertOk();

        // Reto de una semana pasada, ya fuera del rango que devuelve
        // GET /challenges -- por eso completed_challenges necesita su propio
        // conteo en vez de derivarse de esa lista.
        // Esta línea sirve para crear un reto de la semana pasada.
        $challenge = Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_test', 'title' => 'Reto de prueba', 'description' => 'Test',
            // Esta línea sirve para asignar el tipo y los criterios.
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => 1],
            // Esta línea sirve para asignar las fechas de la semana pasada.
            'starts_at' => now()->subWeek()->toDateString(), 'ends_at' => now()->subWeek()->toDateString(),
        ]);
        // Esta línea sirve para registrar al usuario como participante completado.
        ChallengeParticipant::query()->create([
            // Esta línea sirve para asignar el reto, el usuario, el progreso y que está completado.
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 1, 'completed' => true,
        ]);

        // Esta línea sirve para pedir el dashboard.
        $response = $client->getJson('/api/v1/stats/dashboard');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.total_workouts" sea 2.
        $response->assertJsonPath('data.total_workouts', 2);
        // Esta línea sirve para exigir que "data.completed_challenges" sea 1.
        $response->assertJsonPath('data.completed_challenges', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que el dashboard solo refleja los datos del usuario autenticado.
    public function test_dashboard_only_reflects_the_authenticated_users_data(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio para el dueño.
        [$day] = $this->makeRoutineDayWithOneExercise($owner);
        // Esta línea sirve para guardar el cliente HTTP autenticado como owner.
        $ownerClient = $this->actingAs($owner, 'sanctum');

        // Esta línea sirve para iniciar un entrenamiento del dueño.
        $session = $ownerClient->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id de su ejercicio.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para completar el entrenamiento.
        $ownerClient->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        // Esta línea sirve para hacer GET a /api/v1/stats/dashboard autenticado como other.
        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/stats/dashboard');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.total_sets" sea 0.
        $response->assertJsonPath('data.total_sets', 0);
    }

    // Esta línea sirve para declarar el test que comprueba que una segunda consulta del dashboard no vuelve a leer las tablas.
    public function test_a_second_dashboard_request_does_not_requery_the_underlying_tables(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para pedir el dashboard y exigir 200.
        $client->getJson('/api/v1/stats/dashboard')->assertOk();

        // Esta línea sirve para activar el registro de consultas SQL.
        DB::enableQueryLog();
        // Esta línea sirve para pedir el dashboard otra vez y exigir 200.
        $client->getJson('/api/v1/stats/dashboard')->assertOk();
        // Esta línea sirve para juntar las consultas ejecutadas en un texto.
        $queries = collect(DB::getQueryLog())->pluck('query')->implode(' | ');
        // Esta línea sirve para desactivar el registro de consultas.
        DB::disableQueryLog();

        // Esta línea sirve para exigir que no se haya consultado user_stats_daily.
        $this->assertStringNotContainsString('user_stats_daily', $queries);
        // Esta línea sirve para exigir que no se haya consultado workout_sessions.
        $this->assertStringNotContainsString('workout_sessions', $queries);
        // Esta línea sirve para exigir que no se haya consultado personal_records.
        $this->assertStringNotContainsString('personal_records', $queries);
    }

    // Esta línea sirve para declarar el test que comprueba que completar una sesión invalida la caché del dashboard.
    public function test_completing_a_session_busts_the_dashboard_cache(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para pedir el dashboard y exigir 0 series.
        $client->getJson('/api/v1/stats/dashboard')->assertOk()->assertJsonPath('data.total_sets', 0);

        // Esta línea sirve para iniciar un entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id de su ejercicio.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);
        // Esta línea sirve para completar el entrenamiento con 45 minutos.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", ['duration_minutes' => 45]);

        // Esta línea sirve para pedir el dashboard.
        $response = $client->getJson('/api/v1/stats/dashboard');
        // Esta línea sirve para exigir 200 y que "data.total_sets" sea 1.
        $response->assertOk()->assertJsonPath('data.total_sets', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que registrar un récord nuevo invalida la caché del dashboard.
    public function test_logging_a_new_personal_record_busts_the_dashboard_cache(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un día de rutina con un ejercicio.
        [$day] = $this->makeRoutineDayWithOneExercise($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para pedir el dashboard y exigir 0 récords recientes.
        $client->getJson('/api/v1/stats/dashboard')->assertOk()->assertJsonCount(0, 'data.recent_personal_records');

        // Esta línea sirve para iniciar un entrenamiento.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $day->id])->json('data');
        // Esta línea sirve para obtener el id de su ejercicio.
        $weId = $session['exercises'][0]['id'];
        // Esta línea sirve para registrar una serie de 100 kg x 10.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/exercises/{$weId}/sets", ['weight_kg' => 100, 'reps' => 10]);

        // Esta línea sirve para pedir el dashboard.
        $response = $client->getJson('/api/v1/stats/dashboard');
        // Esta línea sirve para exigir 200 y 1 récord reciente.
        $response->assertOk()->assertJsonCount(1, 'data.recent_personal_records');
    }
}
