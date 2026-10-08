<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Chat.

namespace Tests\Feature\Chat;

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

// Esta línea sirve para declarar la clase de tests ChatApiTest.
class ChatApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea la relación entrenador-cliente.
    private function makeRelation(User $trainer, User $client, string $status = 'active'): TrainerClient
    {
        // Esta línea sirve para crear y devolver la relación.
        return TrainerClient::query()->create([
            // Esta línea sirve para asignar $trainer->id al campo "trainer_id".
            'trainer_id' => $trainer->id,
            // Esta línea sirve para asignar $client->id al campo "client_id".
            'client_id' => $client->id,
            // Esta línea sirve para asignar $status al campo "status".
            'status' => $status,
            // Esta línea sirve para asignar now() al campo "started_at".
            'started_at' => now(),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/conversations sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/conversations')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que cualquiera de las dos partes puede abrir la conversación.
    public function test_either_party_can_get_or_create_the_conversation_for_their_relationship(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $asTrainer = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/trainer-clients/{$relation->id}/conversation.
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $asTrainer->assertOk();
        // Esta línea sirve para guardar el id de la conversación abierta por el entrenador.
        $conversationId = $asTrainer->json('data.conversation_id');

        // Esta línea sirve para preparar la petición autenticada como client.
        $asClient = $this->actingAs($client, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/trainer-clients/{$relation->id}/conversation.
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation");
        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $asClient->assertOk();

        // Misma conversación para ambos, creada una sola vez.
        // Esta línea sirve para exigir que "data.conversation_id" sea exactamente $conversationId.
        $this->assertSame($conversationId, $asClient->json('data.conversation_id'));
        // Esta línea sirve para exigir que exista una sola conversación para la relación.
        $this->assertSame(1, ChatConversation::query()->where('trainer_client_id', $relation->id)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que un extraño no puede abrir la conversación.
    public function test_a_stranger_cannot_open_the_conversation(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $stranger = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);

        // Esta línea sirve para preparar la petición autenticada como stranger.
        $this->actingAs($stranger, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/trainer-clients/{$relation->id}/conversation.
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que una relación pausada bloquea abrir la conversación.
    public function test_paused_relationship_blocks_opening_the_conversation(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear una relación pausada.
        $relation = $this->makeRelation($trainer, $client, 'paused');

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/trainer-clients/{$relation->id}/conversation.
            ->getJson("/api/v1/trainer-clients/{$relation->id}/conversation")
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que enviar un mensaje aparece en el hilo y notifica al destinatario.
    public function test_sending_a_message_appears_in_the_thread_and_notifies_the_recipient(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $response = $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola, ¿cómo va la rodilla?']);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.body" sea 'Hola, ¿cómo va la rodilla?'.
        $response->assertJsonPath('data.body', 'Hola, ¿cómo va la rodilla?');
        // Esta línea sirve para exigir que "data.sender_id" sea $trainer->id.
        $response->assertJsonPath('data.sender_id', $trainer->id);
        // Esta línea sirve para exigir que "data.is_mine" sea true.
        $response->assertJsonPath('data.is_mine', true);

        // Esta línea sirve para exigir que la tabla chat_messages tenga un registro con estos datos.
        $this->assertDatabaseHas('chat_messages', [
            // Esta línea sirve para asignar la conversación, el remitente y el texto del mensaje.
            'conversation_id' => $conversation->id, 'sender_id' => $trainer->id, 'body' => 'Hola, ¿cómo va la rodilla?',
        ]);
        // Esta línea sirve para exigir que el cliente tenga una notificación.
        $this->assertSame(1, $client->fresh()->notifications()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede enviar a la conversación de otros.
    public function test_sending_a_message_to_someone_elses_conversation_is_forbidden(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para crear un usuario de prueba.
        $intruder = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como intruder.
        $this->actingAs($intruder, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola'])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el texto del mensaje es obligatorio.
    public function test_message_body_is_required(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", [])
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que la bandeja muestra el último mensaje y los no leídos desde la vista de cada uno.
    public function test_inbox_lists_conversations_with_last_message_and_unread_count_from_the_viewers_perspective(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para enviar un mensaje como entrenador.
        $this->actingAs($trainer, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Primero']);
        // Esta línea sirve para enviar un mensaje como cliente.
        $this->actingAs($client, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Segundo']);

        // Esta línea sirve para hacer GET a /api/v1/conversations autenticado como trainer.
        $inbox = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $inbox->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $inbox->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.last_message.body" sea 'Segundo'.
        $inbox->assertJsonPath('data.0.last_message.body', 'Segundo');
        // Esta línea sirve para exigir que "data.0.other_party.id" sea $client->id.
        $inbox->assertJsonPath('data.0.other_party.id', $client->id);
        // Esta línea sirve para exigir 1 mensaje sin leer (el del cliente).
        $inbox->assertJsonPath('data.0.unread_count', 1); // el de "Segundo", enviado por el cliente, sin leer todavía
    }

    // Esta línea sirve para declarar el test que comprueba que consultar los mensajes marca como leídos los de la otra parte.
    public function test_fetching_messages_marks_the_other_partys_messages_as_read(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para enviar un mensaje como cliente.
        $this->actingAs($client, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola coach']);

        // Esta línea sirve para hacer GET a /api/v1/conversations autenticado como trainer.
        $before = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');
        // Esta línea sirve para exigir que "data.0.unread_count" sea 1.
        $before->assertJsonPath('data.0.unread_count', 1);

        // Esta línea sirve para hacer la petición a /api/v1/conversations/{$conversation->id}/messages como trainer y exigir que responda 200.
        $this->actingAs($trainer, 'sanctum')->getJson("/api/v1/conversations/{$conversation->id}/messages")->assertOk();

        // Esta línea sirve para hacer GET a /api/v1/conversations autenticado como trainer.
        $after = $this->actingAs($trainer, 'sanctum')->getJson('/api/v1/conversations');
        // Esta línea sirve para exigir que "data.0.unread_count" sea 0.
        $after->assertJsonPath('data.0.unread_count', 0);

        // Esta línea sirve para exigir que la tabla chat_messages tenga ese registro.
        $this->assertDatabaseHas('chat_messages', ['conversation_id' => $conversation->id, 'sender_id' => $client->id]);
        // Esta línea sirve para exigir que el mensaje tenga fecha de lectura.
        $this->assertNotNull(ChatMessage::query()->where('conversation_id', $conversation->id)->first()->read_at);
    }

    // Esta línea sirve para declarar el test que comprueba que leer el hilo no marca como leídos mis propios mensajes.
    public function test_reading_a_thread_does_not_mark_my_own_messages_as_read_by_someone_else(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para enviar un mensaje como entrenador.
        $this->actingAs($trainer, 'sanctum')->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);
        // El propio entrenador vuelve a pedir el hilo — no debería "leer" su propio mensaje.
        // Esta línea sirve para consultar los mensajes como entrenador.
        $this->actingAs($trainer, 'sanctum')->getJson("/api/v1/conversations/{$conversation->id}/messages");

        // Esta línea sirve para exigir que el mensaje siga sin fecha de lectura.
        $this->assertNull(ChatMessage::query()->where('conversation_id', $conversation->id)->first()->read_at);
    }

    // Esta línea sirve para declarar el test que comprueba que los mensajes se paginan con "before".
    public function test_messages_can_be_paginated_with_before(): void
    {
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = $this->makeRelation($trainer, $client);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como trainer.
        $client_ = $this->actingAs($trainer, 'sanctum');

        // Esta línea sirve para enviar el primer mensaje y guardar su id.
        $first = $client_->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'uno'])->json('data.id');
        // Esta línea sirve para enviar el segundo mensaje.
        $client_->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'dos']);

        // Esta línea sirve para pedir los mensajes anteriores al primero.
        $response = $client_->getJson("/api/v1/conversations/{$conversation->id}/messages?before={$first}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 0 elementos.
        $response->assertJsonCount(0, 'data');
    }
}
