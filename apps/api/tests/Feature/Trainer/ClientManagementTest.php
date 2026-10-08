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

// Esta línea sirve para declarar la clase de tests ClientManagementTest.
class ClientManagementTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede usar los endpoints del entrenador.
    public function test_a_regular_user_cannot_access_trainer_endpoints(): void
    {
        // Esta línea sirve para crear un usuario con rol normal.
        $user = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/trainer/clients.
            ->getJson('/api/v1/trainer/clients')
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede agregar a un usuario existente como cliente.
    public function test_trainer_can_add_an_existing_user_as_a_client(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $response = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients con los datos enviados.
            ->postJson('/api/v1/trainer/clients', ['email' => $client->email]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.status" sea 'active'.
            ->assertJsonPath('data.status', 'active')
            // Esta línea sirve para exigir que "data.client.id" sea $client->id.
            ->assertJsonPath('data.client.id', $client->id);

        // Esta línea sirve para exigir que la tabla trainer_clients tenga un registro con estos datos.
        $this->assertDatabaseHas('trainer_clients', [
            // Esta línea sirve para asignar $trainer->id al campo "trainer_id".
            'trainer_id' => $trainer->id,
            // Esta línea sirve para asignar $client->id al campo "client_id".
            'client_id' => $client->id,
            // Esta línea sirve para asignar 'active' al campo "status".
            'status' => 'active',
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede agregar un cliente con un correo inexistente.
    public function test_trainer_cannot_add_a_client_by_a_nonexistent_email(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients con los datos enviados.
            ->postJson('/api/v1/trainer/clients', ['email' => 'nadie@example.com'])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'email'.
            ->assertJsonValidationErrors('email');
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede agregar a otro entrenador como cliente.
    public function test_trainer_cannot_add_another_trainer_as_a_client(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients con los datos enviados.
            ->postJson('/api/v1/trainer/clients', ['email' => $otherTrainer->email])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'email'.
            ->assertJsonValidationErrors('email');
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede agregar al mismo cliente dos veces mientras la relación esté activa.
    public function test_trainer_cannot_add_the_same_client_twice_while_the_relationship_is_active(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);
        // Esta línea sirve para agregar al cliente.
        $this->actingAs($trainer, 'sanctum')->postJson('/api/v1/trainer/clients', ['email' => $client->email]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/trainer/clients con los datos enviados.
            ->postJson('/api/v1/trainer/clients', ['email' => $client->email])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'email'.
            ->assertJsonValidationErrors('email');
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador solo ve sus propios clientes.
    public function test_trainer_only_sees_their_own_clients(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $myClient = User::factory()->create(['role' => 'user']);
        // Esta línea sirve para crear un usuario con rol normal.
        $theirClient = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para crear la relación con su cliente.
        TrainerClient::query()->create(['trainer_id' => $trainer->id, 'client_id' => $myClient->id, 'status' => 'active', 'started_at' => now()]);
        // Esta línea sirve para crear la relación de otro entrenador con su cliente.
        TrainerClient::query()->create(['trainer_id' => $otherTrainer->id, 'client_id' => $theirClient->id, 'status' => 'active', 'started_at' => now()]);

        // Esta línea sirve para hacer GET a /api/v1/trainer/clients autenticado como trainer.
        $response = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/trainer/clients');

        // Esta línea sirve para exigir 200 y un solo cliente.
        $response->assertOk()->assertJsonCount(1, 'data')
            // Esta línea sirve para exigir que "data.0.client.id" sea $myClient->id.
            ->assertJsonPath('data.0.client.id', $myClient->id);
    }

    // Esta línea sirve para declarar el test que comprueba que un entrenador no puede ver ni editar el cliente de otro.
    public function test_trainer_cannot_view_or_update_another_trainers_client(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario entrenador.
        $otherTrainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);

        // Esta línea sirve para crear la relación del otro entrenador.
        $trainerClient = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $otherTrainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);

        // Esta línea sirve para guardar el cliente HTTP autenticado como trainer.
        $actingTrainer = $this->actingAs($trainer, 'sanctum');
        // Esta línea sirve para intentar ver el cliente y exigir 403.
        $actingTrainer->getJson("/api/v1/trainer/clients/{$trainerClient->id}")->assertForbidden();
        // Esta línea sirve para intentar editarlo y exigir 403.
        $actingTrainer->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended'])->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el entrenador puede terminar la relación con un cliente.
    public function test_trainer_can_end_a_client_relationship(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario con rol normal.
        $client = User::factory()->create(['role' => 'user']);
        // Esta línea sirve para crear la relación activa.
        $trainerClient = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $response = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/trainer/clients/{$trainerClient->id} con los datos enviados.
            ->patchJson("/api/v1/trainer/clients/{$trainerClient->id}", ['status' => 'ended']);

        // Esta línea sirve para exigir 200 y que "data.status" sea 'ended'.
        $response->assertOk()->assertJsonPath('data.status', 'ended');
        // Esta línea sirve para exigir que la tabla trainer_clients tenga ese registro.
        $this->assertDatabaseHas('trainer_clients', ['id' => $trainerClient->id, 'status' => 'ended']);
        // Esta línea sirve para exigir que en la base de datos "ended_at" no sea null.
        $this->assertNotNull($trainerClient->fresh()->ended_at);
    }
}
