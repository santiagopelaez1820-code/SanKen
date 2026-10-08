<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Progress.

namespace Tests\Feature\Progress;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests BodyMeasurementTest.
class BodyMeasurementTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede registrar una medida.
    public function test_guest_cannot_log_a_measurement(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/body-measurements sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/body-measurements', ['weight_kg' => 80])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede registrar una medida.
    public function test_user_can_log_a_measurement(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/body-measurements autenticado como user con estos datos.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', [
            // Esta línea sirve para asignar 82.5 al campo "weight_kg".
            'weight_kg' => 82.5,
            // Esta línea sirve para asignar 18.2 al campo "body_fat_pct".
            'body_fat_pct' => 18.2,
            // Esta línea sirve para asignar '2026-08-01' al campo "measured_at".
            'measured_at' => '2026-08-01',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.weight_kg" sea 82.5.
        $response->assertJsonPath('data.weight_kg', 82.5);
        // Esta línea sirve para exigir que "data.measured_at" sea '2026-08-01'.
        $response->assertJsonPath('data.measured_at', '2026-08-01');
        // Esta línea sirve para exigir que la tabla body_measurements tenga ese registro.
        $this->assertDatabaseHas('body_measurements', ['user_id' => $user->id, 'weight_kg' => 82.5]);
    }

    // Esta línea sirve para declarar el test que comprueba que la fecha de la medida es hoy si se omite.
    public function test_measured_at_defaults_to_today_when_omitted(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/body-measurements autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', ['weight_kg' => 80]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.measured_at" sea now()->toDateString().
        $response->assertJsonPath('data.measured_at', now()->toDateString());
    }

    // Esta línea sirve para declarar el test que comprueba que se exige al menos una métrica.
    public function test_at_least_one_metric_is_required(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer POST a /api/v1/body-measurements autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/body-measurements', []);

        // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
        $response->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que el historial se pagina y va del más reciente al más antiguo.
    public function test_history_is_paginated_and_ordered_by_most_recent_first(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para registrar una medida del 1 de julio.
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 80, 'measured_at' => '2026-07-01']);
        // Esta línea sirve para registrar una medida del 1 de agosto.
        $client->postJson('/api/v1/body-measurements', ['weight_kg' => 79, 'measured_at' => '2026-08-01']);

        // Esta línea sirve para pedir el historial.
        $response = $client->getJson('/api/v1/body-measurements');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.0.measured_at" sea '2026-08-01'.
        $response->assertJsonPath('data.0.measured_at', '2026-08-01');
        // Esta línea sirve para exigir que "data.1.measured_at" sea '2026-07-01'.
        $response->assertJsonPath('data.1.measured_at', '2026-07-01');
        // Esta línea sirve para exigir que "meta.total" sea 2.
        $response->assertJsonPath('meta.total', 2);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario solo ve sus propias medidas.
    public function test_user_only_sees_their_own_measurements(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $owner = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $other = User::factory()->create();
        // Esta línea sirve para registrar una medida del dueño.
        $this->actingAs($owner, 'sanctum')->postJson('/api/v1/body-measurements', ['weight_kg' => 80]);

        // Esta línea sirve para hacer GET a /api/v1/body-measurements autenticado como other.
        $response = $this->actingAs($other, 'sanctum')->getJson('/api/v1/body-measurements');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "meta.total" sea 0.
        $response->assertJsonPath('meta.total', 0);
    }
}
