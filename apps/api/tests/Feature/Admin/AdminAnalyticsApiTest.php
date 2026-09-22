<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\UserActivityEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
class AdminAnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'super_admin']);
    }

    private function event(User $user, string $type, \DateTimeInterface $at, ?string $platform = 'web'): UserActivityEvent
    {
        return UserActivityEvent::query()->create([
            'user_id' => $user->id,
            'event_type' => $type,
            'platform' => $platform,
            'occurred_at' => $at,
            'activity_date' => $at->format('Y-m-d'),
        ]);
    }

    public function test_non_admin_cannot_access_overview(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/analytics/overview')->assertForbidden();
    }

    public function test_non_admin_cannot_access_activity(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/analytics/activity')->assertForbidden();
    }

    public function test_active_user_with_multiple_events_counts_once_but_sessions_count_each(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();
        $kenneth = User::factory()->create();

        // Kenneth entra 5 veces hoy: 5 sesiones, pero 1 solo usuario activo.
        for ($i = 0; $i < 5; $i++) {
            $this->event($kenneth, UserActivityEvent::TYPE_LOGIN, now()->addMinutes($i));
        }

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        $response->assertOk();
        // Kenneth + el admin (su propia request también cuenta).
        $this->assertSame(2, $response->json('data.active_today'));
        // Sesiones solo cuenta 'login': el heartbeat del admin no es una sesión.
        $this->assertSame(5, $response->json('data.sessions'));
    }

    public function test_two_different_active_users_count_as_two_distinct_people(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();
        $a = User::factory()->create();
        $b = User::factory()->create();

        $this->event($a, UserActivityEvent::TYPE_HEARTBEAT, now());
        $this->event($b, UserActivityEvent::TYPE_HEARTBEAT, now());

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // a, b y el admin: 3 usuarios ÚNICOS (no colapsan a 1 por tener el mismo evento).
        $this->assertSame(3, $response->json('data.active_today'));
    }

    public function test_today_metric_excludes_yesterdays_activity(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now()->subDay());

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Si "ayer" se filtrara mal, esto daría 2 en vez de 1 (solo el admin).
        $this->assertSame(1, $response->json('data.active_today'));
    }

    public function test_midnight_boundary_does_not_leak_into_next_day(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        // Actividad a las 23:55 de un día...
        $this->travelTo(now()->setTime(23, 55));
        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now());

        // ...10 minutos después ya es otro día calendario.
        $this->travelTo(now()->addMinutes(10));

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Si la actividad de las 23:55 leakeara al nuevo día, esto daría 2.
        $this->assertSame(1, $response->json('data.active_today'));
    }

    public function test_week_metric_respects_week_boundaries(): void
    {
        $this->travelTo(now()->startOfWeek()->addDays(2)->setTime(12, 0));
        $admin = $this->admin();
        $insideWeek = User::factory()->create();
        $outsideWeek = User::factory()->create();

        $this->event($insideWeek, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfWeek());
        $this->event($outsideWeek, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfWeek()->subDay());

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=week');

        // insideWeek + admin. Si la semana anterior leakeara, esto daría 3.
        $this->assertSame(2, $response->json('data.active_week'));
    }

    public function test_month_metric_respects_calendar_month(): void
    {
        $this->travelTo(now()->startOfMonth()->addDays(10));
        $admin = $this->admin();
        $insideMonth = User::factory()->create();
        $lastMonth = User::factory()->create();

        $this->event($insideMonth, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfMonth());
        $this->event($lastMonth, UserActivityEvent::TYPE_HEARTBEAT, now()->startOfMonth()->subDay());

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=month');

        // insideMonth + admin. Si el mes anterior leakeara, esto daría 3.
        $this->assertSame(2, $response->json('data.active_month'));
    }

    public function test_new_users_are_scoped_to_the_selected_period(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();
        User::factory()->create(['created_at' => now()]);
        User::factory()->create(['created_at' => now()->subDays(5)]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // +1 por $admin, que también se creó "ahora" (new_users cuenta por users.created_at, no por actividad).
        $this->assertSame(2, $response->json('data.new_users'));
    }

    public function test_change_pct_is_null_when_previous_period_has_no_data(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();
        User::factory()->create(['created_at' => now()]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        $this->assertNull($response->json('data.new_users_change_pct'));
    }

    public function test_change_pct_compares_against_previous_period(): void
    {
        $this->travelTo(now()->setTime(12, 0));
        $admin = $this->admin();

        User::factory()->count(2)->create(['created_at' => now()->subDay()->setTime(10, 0)]);
        User::factory()->count(3)->create(['created_at' => now()]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=today');

        // Hoy: admin (1) + 3 = 4 nuevos. Ayer: 2. (4-2)/2*100 = 100%.
        // assertEquals (no assertSame): un 100.0 sin parte fraccionaria se
        // serializa como JSON entero, así que vuelve como int 100 al decodificar.
        $this->assertEquals(100.0, $response->json('data.new_users_change_pct'));
    }

    public function test_activity_series_has_no_gaps_for_days_without_activity(): void
    {
        $this->travelTo(now()->startOfWeek()->addDays(3)->setTime(12, 0));
        $admin = $this->admin();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/activity?period=week');

        $response->assertOk();
        $points = $response->json('data.points');
        $this->assertCount(7, $points);

        // Nadie generó actividad salvo el propio admin al pedir esto (hoy):
        // exactamente 1 de los 7 días tiene valor 1, el resto 0 — ninguno rompe ni falta.
        $today = now()->toDateString();
        foreach ($points as $point) {
            $this->assertSame($point['date'] === $today ? 1 : 0, $point['value']);
        }
    }

    public function test_activity_series_today_has_24_hourly_points(): void
    {
        $this->travelTo(now()->setTime(14, 30));
        $admin = $this->admin();
        $user = User::factory()->create();
        $this->event($user, UserActivityEvent::TYPE_HEARTBEAT, now());

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/activity?period=today');

        $response->assertOk();
        $points = $response->json('data.points');
        $this->assertCount(24, $points);
        // $user + el propio admin, ambos a las 14:xx.
        $this->assertSame(2, $points[14]['value']);
        $this->assertSame(0, $points[0]['value']);
    }

    public function test_login_endpoint_records_a_session_event(): void
    {
        // Contraseña por defecto de UserFactory ('password', ya hasheada).
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('user_activity_events', [
            'user_id' => $user->id,
            'event_type' => UserActivityEvent::TYPE_LOGIN,
        ]);
    }

    public function test_invalid_period_falls_back_to_today(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/analytics/overview?period=nonsense');

        $response->assertOk();
        $this->assertSame('today', $response->json('data.period'));
    }
}
