<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use App\Models\UserActivityEvent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TouchLastActiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_authenticated_request_stamps_last_active_at(): void
    {
        $user = User::factory()->create(['last_active_at' => null]);

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertNotNull($user->fresh()->last_active_at);
    }

    public function test_it_does_not_rewrite_last_active_at_within_the_5_minute_window(): void
    {
        // A mitad de hora, lejos de cualquier límite: el refresh forzado por
        // cambio de hora (ver test de abajo) no debe interferir acá.
        $this->travelTo(Carbon::now()->startOfHour()->addMinutes(30));
        $user = User::factory()->create(['last_active_at' => Carbon::now()->subMinutes(2)]);
        // La columna es `timestamp` (precisión de segundo) — comparar
        // contra el valor ya truncado que devolvió la DB, no contra el
        // Carbon original con microsegundos, para no comparar peras con
        // manzanas.
        $recent = $user->fresh()->last_active_at;

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertTrue($user->fresh()->last_active_at->equalTo($recent));
    }

    public function test_it_refreshes_last_active_at_once_the_5_minute_window_has_passed(): void
    {
        $this->travelTo(Carbon::now()->startOfHour()->addMinutes(30));
        $stale = Carbon::now()->subMinutes(10);
        $user = User::factory()->create(['last_active_at' => $stale]);

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertTrue($user->fresh()->last_active_at->gt($stale));
    }

    /**
     * Regresión: si `last_active_at` solo se refrescara con el throttle de 5
     * minutos, una request justo después de cruzar la hora seguiría viendo
     * el valor de la hora anterior en requests siguientes (no alcanzaron los
     * 5 minutos) y el chequeo de "¿ya cambió la hora?" de TouchLastActive
     * volvería a dar true en cada una, insertando un heartbeat duplicado por
     * request hasta que el throttle de 5 minutos alcance a ponerse al día.
     */
    public function test_crossing_an_hour_boundary_creates_exactly_one_heartbeat_even_with_frequent_requests(): void
    {
        $this->travelTo(Carbon::now()->startOfHour()->subMinutes(2));
        $user = User::factory()->create(['last_active_at' => null]);

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();
        $stampBeforeBoundary = $user->fresh()->last_active_at;

        // Cruza a la hora siguiente, pero solo 3 minutos después (dentro del
        // throttle normal de 5 minutos).
        $this->travelTo(Carbon::now()->addMinutes(3));
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        $this->assertTrue($user->fresh()->last_active_at->gt($stampBeforeBoundary));
        $this->assertSame(2, UserActivityEvent::query()->where('user_id', $user->id)->count());
    }
}
