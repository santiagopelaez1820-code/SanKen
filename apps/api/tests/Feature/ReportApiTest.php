<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo ChatConversation.
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo ChatMessage.
use App\Models\ChatMessage;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ReportApiTest.
class ReportApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/reports sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/reports', [])->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede reportar un mensaje de chat.
    public function test_user_can_report_a_chat_message(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador y el cliente.
            'trainer_id' => $trainer->id, 'client_id' => $client->id,
            // Esta línea sirve para asignar el estado activo y la fecha de inicio.
            'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        // Esta línea sirve para crear el mensaje a reportar.
        $message = ChatMessage::query()->create([
            // Esta línea sirve para asignar la conversación, el remitente y el texto.
            'conversation_id' => $conversation->id, 'sender_id' => $trainer->id, 'body' => 'contenido inapropiado',
        ]);

        // Esta línea sirve para hacer POST a /api/v1/reports autenticado como client con estos datos.
        $response = $this->actingAs($client, 'sanctum')->postJson('/api/v1/reports', [
            // Esta línea sirve para asignar 'chat_message' al campo "reportable_type".
            'reportable_type' => 'chat_message',
            // Esta línea sirve para asignar $message->id al campo "reportable_id".
            'reportable_id' => $message->id,
            // Esta línea sirve para asignar 'inappropriate_content' al campo "reason".
            'reason' => 'inappropriate_content',
            // Esta línea sirve para asignar 'Me hizo sentir incómodo.' al campo "details".
            'details' => 'Me hizo sentir incómodo.',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.status" sea exactamente 'pending'.
        $this->assertSame('pending', $response->json('data.status'));
        // Esta línea sirve para exigir que la tabla reports tenga un registro con estos datos.
        $this->assertDatabaseHas('reports', [
            // Esta línea sirve para asignar $client->id al campo "reporter_id".
            'reporter_id' => $client->id,
            // Esta línea sirve para asignar 'chat_message' al campo "reportable_type".
            'reportable_type' => 'chat_message',
            // Esta línea sirve para asignar $message->id al campo "reportable_id".
            'reportable_id' => $message->id,
            // Esta línea sirve para asignar 'pending' al campo "status".
            'status' => 'pending',
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que el motivo debe ser un valor conocido.
    public function test_reason_must_be_a_known_value(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/reports como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/reports', [
            // Esta línea sirve para enviar el tipo, el id y un motivo inválido.
            'reportable_type' => 'chat_message', 'reportable_id' => 1, 'reason' => 'not-a-real-reason',
            // Esta línea sirve para cerrar los datos y exigir 422.
        ])->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que un tipo fuera de la lista permitida se rechaza.
    public function test_reportable_type_outside_the_allow_list_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/reports como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/reports', [
            // Esta línea sirve para enviar un tipo no permitido, un id y un motivo.
            'reportable_type' => 'user', 'reportable_id' => 1, 'reason' => 'abuse',
            // Esta línea sirve para cerrar los datos y exigir 422.
        ])->assertStatus(422);
    }
}
