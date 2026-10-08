<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Middleware.

namespace Tests\Feature\Middleware;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo UserActivityEvent.
use App\Models\UserActivityEvent;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase Carbon.
use Illuminate\Support\Carbon;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests TouchLastActiveTest.
class TouchLastActiveTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que una petición autenticada marca la última actividad.
    public function test_an_authenticated_request_stamps_last_active_at(): void
    {
        // Esta línea sirve para crear un usuario sin última actividad.
        $user = User::factory()->create(['last_active_at' => null]);

        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        // Esta línea sirve para exigir que en la base de datos "last_active_at" no sea null.
        $this->assertNotNull($user->fresh()->last_active_at);
    }

    // Esta línea sirve para declarar el test que comprueba que no reescribe la última actividad dentro de la ventana de 5 minutos.
    public function test_it_does_not_rewrite_last_active_at_within_the_5_minute_window(): void
    {
        // A mitad de hora, lejos de cualquier límite: el refresh forzado por
        // cambio de hora (ver test de abajo) no debe interferir acá.
        // Esta línea sirve para fijar la hora en el minuto 30 de la hora actual.
        $this->travelTo(Carbon::now()->startOfHour()->addMinutes(30));
        // Esta línea sirve para crear un usuario activo hace 2 minutos.
        $user = User::factory()->create(['last_active_at' => Carbon::now()->subMinutes(2)]);
        // La columna es `timestamp` (precisión de segundo) — comparar
        // contra el valor ya truncado que devolvió la DB, no contra el
        // Carbon original con microsegundos, para no comparar peras con
        // manzanas.
        // Esta línea sirve para guardar la última actividad actual.
        $recent = $user->fresh()->last_active_at;

        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        // Esta línea sirve para exigir que la última actividad no haya cambiado.
        $this->assertTrue($user->fresh()->last_active_at->equalTo($recent));
    }

    // Esta línea sirve para declarar el test que comprueba que la actualiza al pasar la ventana de 5 minutos.
    public function test_it_refreshes_last_active_at_once_the_5_minute_window_has_passed(): void
    {
        // Esta línea sirve para fijar la hora en el minuto 30 de la hora actual.
        $this->travelTo(Carbon::now()->startOfHour()->addMinutes(30));
        // Esta línea sirve para calcular una actividad de hace 10 minutos.
        $stale = Carbon::now()->subMinutes(10);
        // Esta línea sirve para crear un usuario con esa actividad.
        $user = User::factory()->create(['last_active_at' => $stale]);

        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        // Esta línea sirve para exigir que la última actividad sea más reciente.
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
    // Esta línea sirve para declarar el test que comprueba que cruzar una hora crea un solo heartbeat aunque haya peticiones frecuentes.
    public function test_crossing_an_hour_boundary_creates_exactly_one_heartbeat_even_with_frequent_requests(): void
    {
        // Esta línea sirve para fijar la hora 2 minutos antes de cambiar de hora.
        $this->travelTo(Carbon::now()->startOfHour()->subMinutes(2));
        // Esta línea sirve para crear un usuario sin última actividad.
        $user = User::factory()->create(['last_active_at' => null]);

        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();
        // Esta línea sirve para guardar la última actividad antes del cambio de hora.
        $stampBeforeBoundary = $user->fresh()->last_active_at;

        // Cruza a la hora siguiente, pero solo 3 minutos después (dentro del
        // throttle normal de 5 minutos).
        // Esta línea sirve para avanzar 3 minutos (ya es otra hora).
        $this->travelTo(Carbon::now()->addMinutes(3));
        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();
        // Esta línea sirve para hacer la petición a /api/v1/exercises como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises')->assertOk();

        // Esta línea sirve para exigir que la última actividad se haya actualizado.
        $this->assertTrue($user->fresh()->last_active_at->gt($stampBeforeBoundary));
        // Esta línea sirve para exigir que haya exactamente 2 eventos de actividad del usuario.
        $this->assertSame(2, UserActivityEvent::query()->where('user_id', $user->id)->count());
    }
}
