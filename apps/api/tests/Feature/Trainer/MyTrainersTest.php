<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Trainer.

namespace Tests\Feature\Trainer;

// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests MyTrainersTest.
class MyTrainersTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/me/trainers sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/me/trainers')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que lista solo las relaciones activas con entrenadores.
    public function test_lists_only_active_trainer_relationships(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un entrenador activo.
        $activeTrainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Activo']);
        // Esta línea sirve para crear un entrenador con relación terminada.
        $endedTrainer = User::factory()->create(['role' => 'trainer', 'name' => 'Coach Viejo']);

        // Esta línea sirve para crear la relación activa.
        TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $activeTrainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la relación terminada.
        TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado terminado y las fechas.
            'trainer_id' => $endedTrainer->id, 'client_id' => $client->id, 'status' => 'ended', 'started_at' => now(), 'ended_at' => now(),
        ]);

        // Esta línea sirve para hacer GET a /api/v1/me/trainers autenticado como client.
        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/me/trainers');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.trainer.name" sea 'Coach Activo'.
        $response->assertJsonPath('data.0.trainer.name', 'Coach Activo');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario sin entrenador recibe una lista vacía.
    public function test_a_user_with_no_trainer_gets_an_empty_list(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/me/trainers autenticado como client.
        $response = $this->actingAs($client, 'sanctum')->getJson('/api/v1/me/trainers');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $response->assertJsonCount(0, 'data');
    }
}
