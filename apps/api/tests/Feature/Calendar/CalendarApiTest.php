<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Calendar.

namespace Tests\Feature\Calendar;

// Esta línea sirve para importar el modelo CalendarReminder.
use App\Models\CalendarReminder;
// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
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

// Esta línea sirve para declarar la clase de tests CalendarApiTest.
class CalendarApiTest extends TestCase
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

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/calendar?month=2026-08 sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/calendar?month=2026-08')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el mes debe tener el formato esperado.
    public function test_month_must_match_the_expected_format(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08-01.
            ->getJson('/api/v1/calendar?month=2026-08-01')
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que lista las sesiones completadas del rango con el nombre del día de rutina.
    public function test_lists_completed_sessions_in_range_using_the_routine_day_label(): void
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

        // Esta línea sirve para crear una sesión completada dentro del mes.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, el día y la fecha.
            'user_id' => $user->id, 'routine_day_id' => $day->id, 'performed_at' => '2026-08-05',
            // Esta línea sirve para asignar que está completada y su duración.
            'completed' => true, 'duration_minutes' => 40,
        ]);
        // Fuera de rango: no debe aparecer.
        // Esta línea sirve para crear una sesión completada del mes anterior.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y que está completada.
            'user_id' => $user->id, 'performed_at' => '2026-07-31', 'completed' => true,
        ]);
        // Incompleta: no debe aparecer.
        // Esta línea sirve para crear una sesión no completada.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y que no está completada.
            'user_id' => $user->id, 'performed_at' => '2026-08-06', 'completed' => false,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para convertir "data.events" de la respuesta en una colección.
        $events = collect($response->json('data.events'));
        // Esta línea sirve para buscar el evento de entrenamiento completado.
        $completed = $events->firstWhere('type', 'workout_completed');
        // Esta línea sirve para exigir que completed exista (no sea null).
        $this->assertNotNull($completed);
        // Esta línea sirve para exigir que la fecha del evento sea la de la sesión.
        $this->assertSame('2026-08-05', $completed['event_date']);
        // Esta línea sirve para exigir que el título sea el nombre del día de rutina.
        $this->assertSame('Full Body A', $completed['title']);
        // Esta línea sirve para exigir que haya un solo evento completado.
        $this->assertSame(1, $events->where('type', 'workout_completed')->count());
    }

    // Esta línea sirve para declarar el test que comprueba que la sesión completada informa los grupos musculares trabajados.
    public function test_completed_session_reports_the_real_muscle_groups_worked(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para obtener el id de un ejercicio de pecho.
        $chestExerciseId = Exercise::query()->where('name', 'Press banca con barra')->value('id');
        // Esta línea sirve para obtener el id de un ejercicio de tríceps.
        $tricepsExerciseId = Exercise::query()->where('name', 'Press francés')->value('id');

        // Esta línea sirve para crear una sesión completada.
        $session = WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y que está completada.
            'user_id' => $user->id, 'performed_at' => '2026-08-05', 'completed' => true,
        ]);
        // Esta línea sirve para agregar el ejercicio de pecho a la sesión.
        $session->exercises()->create(['exercise_id' => $chestExerciseId, 'order' => 1, 'target_sets' => 3]);
        // Esta línea sirve para agregar el ejercicio de tríceps a la sesión.
        $session->exercises()->create(['exercise_id' => $tricepsExerciseId, 'order' => 2, 'target_sets' => 3]);

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para buscar el evento de entrenamiento completado.
        $completed = collect($response->json('data.events'))->firstWhere('type', 'workout_completed');
        // Esta línea sirve para exigir que completed exista (no sea null).
        $this->assertNotNull($completed);
        // Esta línea sirve para exigir que los grupos musculares sean Pecho y Tríceps.
        $this->assertEqualsCanonicalizing(['Pecho', 'Tríceps'], $completed['muscle_groups']);
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenamiento planeado informa los músculos objetivo del día.
    public function test_planned_workout_reports_the_routine_days_target_muscle_groups(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una rutina activa.
        $routine = Routine::query()->create([
            // Esta línea sirve para asignar el usuario, el origen y el objetivo.
            'user_id' => $user->id, 'source' => 'engine', 'goal' => 'gain_muscle',
            // Esta línea sirve para asignar la división, la frecuencia, la duración y dejarla activa.
            'split_type' => 'full_body', 'frequency_days' => 3, 'duration_weeks' => 6, 'is_active' => true,
        ]);
        // Esta línea sirve para crear un día de la rutina con músculos objetivo.
        $routine->days()->create(['day_order' => 1, 'label' => 'Push', 'target_muscle_groups' => ['chest', 'triceps']]);

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para buscar el evento de entrenamiento planeado.
        $planned = collect($response->json('data.events'))->firstWhere('type', 'workout_planned');
        // Esta línea sirve para exigir que planned exista (no sea null).
        $this->assertNotNull($planned);
        // Esta línea sirve para exigir que los grupos musculares sean Pecho y Tríceps.
        $this->assertEqualsCanonicalizing(['Pecho', 'Tríceps'], $planned['muscle_groups']);

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que se incluye una sesión del último día del mes.
    public function test_a_session_performed_on_the_last_day_of_the_month_is_included(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una sesión completada el último día del mes.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y que está completada.
            'user_id' => $user->id, 'performed_at' => '2026-08-31', 'completed' => true,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para convertir los eventos de la respuesta en una colección.
        $events = collect($response->json('data.events'));
        // Esta línea sirve para exigir que haya un evento completado ese día.
        $this->assertSame(1, $events->where('type', 'workout_completed')->where('event_date', '2026-08-31')->count());
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenamiento sugerido de hoy solo aparece si hoy está en el mes pedido.
    public function test_includes_todays_suggested_workout_only_when_today_falls_in_the_requested_month(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));

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
        $routine->days()->create(['day_order' => 1, 'label' => 'Push', 'target_muscle_groups' => ['chest']]);

        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para pedir el calendario del mes actual.
        $thisMonth = $client->getJson('/api/v1/calendar?month=2026-08');
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $thisMonth->assertOk();
        // Esta línea sirve para buscar el evento de entrenamiento planeado.
        $planned = collect($thisMonth->json('data.events'))->firstWhere('type', 'workout_planned');
        // Esta línea sirve para exigir que planned exista (no sea null).
        $this->assertNotNull($planned);
        // Esta línea sirve para exigir que la fecha sea la de hoy.
        $this->assertSame('2026-08-12', $planned['event_date']);
        // Esta línea sirve para exigir que el título sea el del día de rutina.
        $this->assertSame('Push', $planned['title']);

        // Esta línea sirve para pedir el calendario de otro mes.
        $otherMonth = $client->getJson('/api/v1/calendar?month=2026-09');
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $otherMonth->assertOk();
        // Esta línea sirve para exigir que en otro mes no haya entrenamiento planeado.
        $this->assertNull(collect($otherMonth->json('data.events'))->firstWhere('type', 'workout_planned'));

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario sin rutina activa no tiene entrenamiento planeado.
    public function test_user_without_an_active_routine_gets_no_planned_entry(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que no haya entrenamiento planeado.
        $this->assertNull(collect($response->json('data.events'))->firstWhere('type', 'workout_planned'));

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que el calendario nunca incluye sesiones de otro usuario.
    public function test_a_users_calendar_never_includes_another_users_sessions(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para crear una sesión completada de otro usuario.
        WorkoutSession::query()->create(['user_id' => $other->id, 'performed_at' => '2026-08-05', 'completed' => true]);

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/calendar?month=2026-08');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.events" tenga 0 elementos.
        $response->assertJsonCount(0, 'data.events');
    }

    // Esta línea sirve para declarar el test que comprueba que se puede crear un recordatorio y aparece en su mes.
    public function test_reminder_can_be_created_and_appears_in_its_month(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/calendar/reminders autenticado como user con estos datos.
        $store = $this->actingAs($user, 'sanctum')->postJson('/api/v1/calendar/reminders', [
            // Esta línea sirve para enviar la fecha, el título y las notas.
            'event_date' => '2026-08-20', 'title' => 'Pesarme', 'notes' => 'En ayunas',
        ]);
        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $store->assertCreated();
        // Esta línea sirve para exigir que "data.type" sea 'reminder'.
        $store->assertJsonPath('data.type', 'reminder');

        // Esta línea sirve para hacer GET a /api/v1/calendar?month=2026-08 sin sesión iniciada.
        $response = $this->getJson('/api/v1/calendar?month=2026-08');
        // Esta línea sirve para buscar el evento de recordatorio.
        $reminder = collect($response->json('data.events'))->firstWhere('type', 'reminder');
        // Esta línea sirve para exigir que reminder exista (no sea null).
        $this->assertNotNull($reminder);
        // Esta línea sirve para exigir que el título sea el enviado.
        $this->assertSame('Pesarme', $reminder['title']);
    }

    // Esta línea sirve para declarar el test que comprueba que el recordatorio exige título y fecha.
    public function test_reminder_requires_a_title_and_a_date(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/calendar/reminders con los datos enviados.
            ->postJson('/api/v1/calendar/reminders', [])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que el dueño puede borrar su recordatorio.
    public function test_owner_can_delete_their_reminder(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un recordatorio.
        $reminder = CalendarReminder::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y el título.
            'user_id' => $user->id, 'event_date' => '2026-08-20', 'title' => 'Pesarme',
        ]);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/calendar/reminders/{$reminder->id}.
            ->deleteJson("/api/v1/calendar/reminders/{$reminder->id}")
            // Esta línea sirve para exigir que la respuesta sea 204 (sin contenido).
            ->assertNoContent();

        // Esta línea sirve para exigir que la tabla calendar_reminders no tenga ese registro.
        $this->assertDatabaseMissing('calendar_reminders', ['id' => $reminder->id]);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede borrar el recordatorio de otro.
    public function test_a_user_cannot_delete_another_users_reminder(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();
        // Esta línea sirve para crear un recordatorio del dueño.
        $reminder = CalendarReminder::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha y el título.
            'user_id' => $owner->id, 'event_date' => '2026-08-20', 'title' => 'Pesarme',
        ]);

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para hacer DELETE a /api/v1/calendar/reminders/{$reminder->id}.
            ->deleteJson("/api/v1/calendar/reminders/{$reminder->id}")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que la tabla calendar_reminders tenga ese registro.
        $this->assertDatabaseHas('calendar_reminders', ['id' => $reminder->id]);
    }
}
