<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Chat.

namespace Tests\Feature\Chat;

// Esta línea sirve para importar la clase MessageSent.
use App\Events\MessageSent;
// Esta línea sirve para importar el modelo ChatConversation.
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo TrainerClient.
use App\Models\TrainerClient;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase NewChatMessageNotification.
use App\Notifications\NewChatMessageNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Event.
use Illuminate\Support\Facades\Event;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests MessageBroadcastTest.
class MessageBroadcastTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que enviar un mensaje emite el evento con los datos correctos.
    public function test_sending_a_message_dispatches_message_sent_with_the_right_payload(): void
    {
        // Esta línea sirve para simular los eventos para revisarlos sin ejecutar sus listeners.
        Event::fake([MessageSent::class]);

        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola'])
            // Esta línea sirve para exigir que la respuesta sea 201 (creado).
            ->assertCreated();

        // Esta línea sirve para exigir que se haya emitido el evento con esta condición.
        Event::assertDispatched(MessageSent::class, function (MessageSent $event) use ($conversation, $trainer) {
            // Esta línea sirve para exigir que sea de la conversación.
            return $event->message->conversation_id === $conversation->id
                // Esta línea sirve para exigir que lo haya enviado el entrenador.
                && $event->message->sender_id === $trainer->id
                // Esta línea sirve para exigir que el texto sea "Hola".
                && $event->message->body === 'Hola';
        });
    }

    // Esta línea sirve para declarar el test que comprueba que enviar un mensaje notifica solo a la otra parte.
    public function test_sending_a_message_notifies_only_the_other_party(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);
        // Esta línea sirve para crear un usuario de prueba.
        $client = User::factory()->create();
        // Esta línea sirve para crear la relación entrenador-cliente.
        $relation = TrainerClient::query()->create([
            // Esta línea sirve para asignar el entrenador, el cliente, el estado activo y la fecha de inicio.
            'trainer_id' => $trainer->id, 'client_id' => $client->id, 'status' => 'active', 'started_at' => now(),
        ]);
        // Esta línea sirve para crear la conversación.
        $conversation = ChatConversation::query()->create(['trainer_client_id' => $relation->id]);

        // Esta línea sirve para preparar la petición autenticada como trainer.
        $this->actingAs($trainer, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/conversations/{$conversation->id}/messages con los datos enviados.
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", ['body' => 'Hola']);

        // Esta línea sirve para exigir que se le haya enviado la notificación NewChatMessageNotification.
        Notification::assertSentTo($client, NewChatMessageNotification::class);
        // Esta línea sirve para exigir que no se haya notificado al remitente.
        Notification::assertNotSentTo($trainer, NewChatMessageNotification::class);
    }
}
