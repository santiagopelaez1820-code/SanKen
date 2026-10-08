<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo UserActivityEvent.
use App\Models\UserActivityEvent;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Nota sobre los números esperados: el propio Super Admin que hace el GET
 * autenticado también dispara TouchLastActive (igual que cualquier request
 * autenticada), así que aparece como +1 usuario activo "ahora" en cualquier
 * período que incluya el instante de la request (today/week/month siempre lo
 * incluyen). Es comportamiento correcto del producto -- el admin viendo el
 * panel también está usando la app -- así que los asserts lo suman a
 * propósito en vez de esquivarlo.
 */
// Esta línea sirve para declarar la clase de tests AdminAnalyticsApiTest.
class AdminAnalyticsApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un super admin.
    private function admin(): User
    {
        // Esta línea sirve para crear y devolver un usuario super admin.
        return User::factory()->create(['role' => 'super_admin']);
    }

    // Esta línea sirve para declarar el método auxiliar que registra un evento de actividad.
    private function event(User $user, string $type, \DateTimeInterface $at, ?string $platform = 'web'): UserActivityEvent
    {
        // Esta línea sirve para crear y devolver el evento de actividad.
        return UserActivityEvent::query()->create([
            // Esta línea sirve para guardar el id del usuario.
            'user_id' => $user->id,
            // Esta línea sirve para guardar el tipo de evento.
            'event_type' => $type,
            // Esta línea sirve para guardar la plataforma.
            'platform' => $platform,
            // Esta línea sirve para guardar el momento del evento.
            'occurred_at' => $at,
            // Esta línea sirve para guardar la fecha del evento.
            'activity_date' => $at->format('Y-m-d'),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede ver el resumen.
    public function test_non_admin_cannot_access_overview(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/analytics/overview como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/analytics/overview')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede ver la actividad.
    public function test_non_admin_cannot_access_activity(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/analytics/activity como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/analytics/activity')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que varios eventos de un usuario cuentan como 1 activo pero como varias sesiones.
    public function test_active_user_with_multiple_events_counts_once_but_sessions_count_each(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $kenneth = User::factory()->create();

        // Kenneth entra 5 veces hoy: 5 sesiones, pero 1 solo usuario activo.
        // Esta línea sirve para repetir 5 veces.
        for ($i = 0; $i < 5; $i++) {
            // Esta línea sirve para registrar un inicio de sesión de Kenneth, un minuto distinto cada vez.
            $this->event($kenneth, UserActivityEvent::TYPE_LOGIN, now()->addMinutes($i));
        }

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Kenneth + el admin (su propia request también cuenta).
        // Esta línea sirve para exigir que "data.active_today" sea exactamente 2.
        $this->assertSame(2, $response->json('data.active_today'));
        // Sesiones solo cuenta 'login': el heartbeat del admin no es una sesión.
        // Esta línea sirve para exigir que "data.sessions" sea exactamente 5.
        $this->assertSame(5, $response->json('data.sessions'));
    }

    // Esta línea sirve para declarar el test que comprueba que dos usuarios activos distintos cuentan como dos personas.
    public function test_two_different_active_users_count_as_two_distinct_people(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $a = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $b = User::factory()->create();

        // Esta línea sirve para registrar actividad del usuario a.
        $this->event($a, UserActivityEvent::TYPE_HEARTBEAT, now());
        // Esta línea sirve para registrar actividad del usuario b.
        $this->event($b, UserActivityEvent::TYPE_HEARTBEAT, now());

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // a, b y el admin: 3 usuarios ÚNICOS (no colapsan a 1 por tener el mismo evento).
        // Esta línea sirve para exigir que "data.active_today" sea exactamente 3.
        $this->assertSame(3, $response->json('data.active_today'));
    }

    // Esta línea sirve para declarar el test que comprueba que la métrica de hoy no incluye la actividad de ayer.
    public function test_today_metric_excludes_yesterdays_activity(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para registrar actividad del usuario ayer.
        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now()->subDay());

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Si "ayer" se filtrara mal, esto daría 2 en vez de 1 (solo el admin).
        // Esta línea sirve para exigir que "data.active_today" sea exactamente 1.
        $this->assertSame(1, $response->json('data.active_today'));
    }

    // Esta línea sirve para declarar el test que comprueba que la medianoche no pasa actividad al día siguiente.
    public function test_midnight_boundary_does_not_leak_into_next_day(): void
    {
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Actividad a las 23:55 de un día...
        // Esta línea sirve para fijar la hora actual a las 23:55.
        $this->travelTo(now()->setTime(23, 55));
        // Esta línea sirve para registrar actividad del usuario a esa hora.
        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now());

        // ...10 minutos después ya es otro día calendario.
        // Esta línea sirve para avanzar 10 minutos (ya es otro día).
        $this->travelTo(now()->addMinutes(10));

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Si la actividad de las 23:55 leakeara al nuevo día, esto daría 2.
        // Esta línea sirve para exigir que "data.active_today" sea exactamente 1.
        $this->assertSame(1, $response->json('data.active_today'));
    }

    // Esta línea sirve para declarar el test que comprueba los límites de la semana.
    public function test_week_metric_respects_week_boundaries(): void
    {
        // Esta línea sirve para fijar la fecha a mitad de la semana a las 12:00.
        $this->travelTo(now()->startOfWeek()->addDays(2)->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $insideWeek = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $outsideWeek = User::factory()->create();

        // Esta línea sirve para registrar actividad al inicio de esta semana.
        $this->event($insideWeek, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfWeek());
        // Esta línea sirve para registrar actividad el día anterior al inicio de la semana.
        $this->event($outsideWeek, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfWeek()->subDay());

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=week autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=week');

        // insideWeek + admin. Si la semana anterior leakeara, esto daría 3.
        // Esta línea sirve para exigir que "data.active_week" sea exactamente 2.
        $this->assertSame(2, $response->json('data.active_week'));
    }

    // Esta línea sirve para declarar el test que comprueba que el mes es el mes calendario.
    public function test_month_metric_respects_calendar_month(): void
    {
        // Esta línea sirve para fijar la fecha al día 11 del mes.
        $this->travelTo(now()->startOfMonth()->addDays(10));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $insideMonth = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $lastMonth = User::factory()->create();

        // Esta línea sirve para registrar actividad el primer día del mes.
        $this->event($insideMonth, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfMonth());
        // Esta línea sirve para registrar actividad el último día del mes anterior.
        $this->event($lastMonth, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfMonth()->subDay());

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=month autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=month');

        // insideMonth + admin. Si el mes anterior leakeara, esto daría 3.
        // Esta línea sirve para exigir que "data.active_month" sea exactamente 2.
        $this->assertSame(2, $response->json('data.active_month'));
    }

    // Esta línea sirve para declarar el test que comprueba que los usuarios nuevos se cuentan solo en el período elegido.
    public function test_new_users_are_scoped_to_the_selected_period(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario registrado hoy.
        User::factory()->create(['created_at' => now()]);
        // Esta línea sirve para crear un usuario registrado hace 5 días.
        User::factory()->create(['created_at' => now()->subDays(5)]);

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // +1 por $admin, que también se creó "ahora" (new_users cuenta por users.created_at, no por actividad).
        // Esta línea sirve para exigir que "data.new_users" sea exactamente 2.
        $this->assertSame(2, $response->json('data.new_users'));
    }

    // Esta línea sirve para declarar el test que comprueba que el porcentaje de cambio es null si el período anterior no tiene datos.
    public function test_change_pct_is_null_when_previous_period_has_no_data(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario registrado hoy.
        User::factory()->create(['created_at' => now()]);

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Esta línea sirve para exigir que "data.new_users_change_pct" sea null.
        $this->assertNull($response->json('data.new_users_change_pct'));
    }

    // Esta línea sirve para declarar el test que comprueba el porcentaje de cambio contra el período anterior.
    public function test_change_pct_compares_against_previous_period(): void
    {
        // Esta línea sirve para fijar la hora actual a las 12:00.
        $this->travelTo(now()->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();

        // Esta línea sirve para crear 2 usuarios registrados ayer.
        User::factory()->count(2)->create(['created_at' => now()->subDay()->setTime(10, 0)]);
        // Esta línea sirve para crear 3 usuarios registrados hoy.
        User::factory()->count(3)->create(['created_at' => now()]);

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Hoy: admin (1) + 3 = 4 nuevos. Ayer: 2. (4-2)/2*100 = 100%.
        // assertEquals (no assertSame): un 100.0 sin parte fraccionaria se
        // serializa como JSON entero, así que vuelve como int 100 al decodificar.
        // Esta línea sirve para exigir que "data.new_users_change_pct" sea igual a 100.0.
        $this->assertEquals(100.0, $response->json('data.new_users_change_pct'));
    }

    // Esta línea sirve para declarar el test que comprueba que la serie de actividad no tiene huecos en días sin actividad.
    public function test_activity_series_has_no_gaps_for_days_without_activity(): void
    {
        // Esta línea sirve para fijar la fecha a mitad de la semana a las 12:00.
        $this->travelTo(now()->startOfWeek()->addDays(3)->setTime(12, 0));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/activity?period=week autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/activity?period=week');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener los puntos de la serie.
        $points = $response->json('data.points');
        // Esta línea sirve para exigir que haya 7 puntos (uno por día).
        $this->assertCount(7, $points);

        // Nadie generó actividad salvo el propio admin al pedir esto (hoy):
        // exactamente 1 de los 7 días tiene valor 1, el resto 0 — ninguno rompe ni falta.
        // Esta línea sirve para obtener la fecha de hoy en texto.
        $today = now()->toDateString();
        // Esta línea sirve para recorrer cada punto.
        foreach ($points as $point) {
            // Esta línea sirve para exigir 1 para hoy y 0 para los demás días.
            $this->assertSame($point['date'] === $today ? 1 : 0, $point['value']);
        }
    }

    // Esta línea sirve para declarar el test que comprueba que la serie de hoy tiene 24 puntos por hora.
    public function test_activity_series_today_has_24_hourly_points(): void
    {
        // Esta línea sirve para fijar la hora actual a las 14:30.
        $this->travelTo(now()->setTime(14, 30));
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar actividad del usuario ahora.
        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now());

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/activity?period=today autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/activity?period=today');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener los puntos de la serie.
        $points = $response->json('data.points');
        // Esta línea sirve para exigir que haya 24 puntos (uno por hora).
        $this->assertCount(24, $points);
        // $user + el propio admin, ambos a las 14:xx.
        // Esta línea sirve para exigir 2 usuarios en la hora 14.
        $this->assertSame(2, $points[14]['value']);
        // Esta línea sirve para exigir 0 usuarios en la hora 0.
        $this->assertSame(0, $points[0]['value']);
    }

    // Esta línea sirve para declarar el test que comprueba que el login registra un evento de sesión.
    public function test_login_endpoint_records_a_session_event(): void
    {
        // Contraseña por defecto de UserFactory ('password', ya hasheada).
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/auth/login sin sesión iniciada.
        $response = $this->postJson('/api/v1/auth/login', [
            // Esta línea sirve para asignar $user->email al campo "email".
            'email' => $user->email,
            // Esta línea sirve para asignar 'password' al campo "password".
            'password' => 'password',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la tabla user_activity_events tenga un registro con estos datos.
        $this->assertDatabaseHas('user_activity_events', [
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar UserActivityEvent::TYPE_LOGIN al campo "event_type".
            'event_type' => UserActivityEvent::TYPE_LOGIN,
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que un período inválido vuelve a "hoy".
    public function test_invalid_period_falls_back_to_today(): void
    {
        // Esta línea sirve para crear el super admin.
        $admin = $this->admin();

        // Esta línea sirve para hacer GET a /api/v1/admin/analytics/overview?period=nonsense autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=nonsense');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.period" sea exactamente 'today'.
        $this->assertSame('today', $response->json('data.period'));
    }
}
