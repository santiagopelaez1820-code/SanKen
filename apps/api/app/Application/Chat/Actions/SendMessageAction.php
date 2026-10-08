<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del chat.

namespace App\Application\Chat\Actions;

// Esta línea sirve para importar el evento que emite el mensaje en tiempo real.
use App\Events\MessageSent;
// Esta línea sirve para importar el modelo ChatConversation (conversación).
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo ChatMessage (mensaje).
use App\Models\ChatMessage;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la notificación de mensaje nuevo.
use App\Notifications\NewChatMessageNotification;

// Esta línea sirve para declarar la acción que envía un mensaje de chat.
class SendMessageAction
{
    // Esta línea sirve para declarar el método que recibe la conversación, quien envía y el texto.
    public function execute(ChatConversation $conversation, User $sender, string $body): ChatMessage
    {
        // Esta línea sirve para crear el mensaje dentro de la conversación.
        $message = $conversation->messages()->create([
            // Esta línea sirve para guardar quién envió el mensaje.
            'sender_id' => $sender->id,
            // Esta línea sirve para guardar el texto del mensaje.
            'body' => $body,
        ]);

        // Sincrónico (no dispatch en cola): tiene que llegar al hilo abierto
        // en el mismo request, ver MessageSent.
        // Esta línea sirve para emitir el mensaje en tiempo real a la conversación abierta.
        MessageSent::dispatch($message->load('sender'));

        // Esta línea sirve para cargar el entrenador y el cliente de la conversación si faltan.
        $conversation->loadMissing('trainerClient.trainer', 'trainerClient.client');
        // Esta línea sirve para obtener la relación entrenador-cliente.
        $trainerClient = $conversation->trainerClient;
        // Esta línea sirve para elegir como destinatario a la otra persona de la conversación.
        $recipient = $trainerClient->trainer_id === $sender->id ? $trainerClient->client : $trainerClient->trainer;
        // Esta línea sirve para enviar la notificación de mensaje nuevo al destinatario.
        $recipient->notify(new NewChatMessageNotification($message));

        // Esta línea sirve para devolver el mensaje creado.
        return $message;
    }
}
