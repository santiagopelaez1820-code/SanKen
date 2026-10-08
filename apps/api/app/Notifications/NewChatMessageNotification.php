<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el modelo ChatMessage (mensaje de chat).
use App\Models\ChatMessage;
// Esta línea sirve para importar el modelo PushDeviceToken (token de un celular).
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo PushSubscription (suscripción de un navegador).
use App\Models\PushSubscription;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el canal de notificaciones push de Expo.
use App\Notifications\Channels\ExpoPushChannel;
// Esta línea sirve para importar el canal de notificaciones Web Push.
use App\Notifications\Channels\WebPushChannel;
// Esta línea sirve para importar el mensaje de difusión en tiempo real.
use Illuminate\Notifications\Messages\BroadcastMessage;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;

/**
 * No implementa ShouldQueue a propósito: tiene que llegar al centro de
 * notificaciones/badge en el mismo request que el mensaje, sin depender de
 * que queue:work esté corriendo — mismo motivo que MessageSent
 * (ShouldBroadcastNow) y ChallengeProgressUpdated en Sprint 10.
 */
// Esta línea sirve para declarar la notificación de mensaje nuevo en el chat.
class NewChatMessageNotification extends Notification
{
    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el mensaje de chat.
        public readonly ChatMessage $message,
    ) {}

    /**
     * @return array<int, string>
     */
    // Esta línea sirve para declarar el método que elige los canales de envío.
    public function via(User $notifiable): array
    {
        // Esta línea sirve para empezar con la base de datos y el tiempo real.
        $channels = ['database', 'broadcast'];

        // Esta línea sirve para revisar si el usuario tiene algún celular registrado.
        if (PushDeviceToken::query()->where('user_id', $notifiable->id)->exists()) {
            // Esta línea sirve para agregar el canal de Expo.
            $channels[] = ExpoPushChannel::class;
        }

        // Esta línea sirve para revisar si el usuario tiene algún navegador suscrito.
        if (PushSubscription::query()->where('user_id', $notifiable->id)->exists()) {
            // Esta línea sirve para agregar el canal de Web Push.
            $channels[] = WebPushChannel::class;
        }

        // Esta línea sirve para devolver los canales.
        return $channels;
    }

    /**
     * @return array{conversation_id: int, sender_name: string, body: string}
     */
    // Esta línea sirve para declarar el método que arma lo que se guarda en la base de datos.
    public function toArray(User $notifiable): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id de la conversación.
            'conversation_id' => $this->message->conversation_id,
            // Esta línea sirve para incluir el nombre de quien envió el mensaje.
            'sender_name' => $this->message->sender->name,
            // Esta línea sirve para incluir el texto recortado a 140 caracteres.
            'body' => str($this->message->body)->limit(140)->toString(),
        ];
    }

    // Esta línea sirve para declarar el método que arma el mensaje en tiempo real.
    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        // Esta línea sirve para crear el mensaje con los mismos datos.
        return new BroadcastMessage($this->toArray($notifiable));
    }

    /**
     * @return array{title: string, body: string, data: array{conversation_id: int}}
     */
    // Esta línea sirve para declarar el método que arma la notificación para Expo.
    public function toExpoPush(User $notifiable): array
    {
        // Esta línea sirve para devolver la notificación.
        return [
            // Esta línea sirve para usar como título el nombre de quien envió.
            'title' => $this->message->sender->name,
            // Esta línea sirve para usar como texto el mensaje recortado a 140 caracteres.
            'body' => str($this->message->body)->limit(140)->toString(),
            // Esta línea sirve para incluir el id de la conversación para abrirla.
            'data' => ['conversation_id' => $this->message->conversation_id],
        ];
    }

    /**
     * @return array{title: string, body: string, data: array{conversation_id: int}}
     */
    // Esta línea sirve para declarar el método que arma la notificación para Web Push.
    public function toWebPush(User $notifiable): array
    {
        // Esta línea sirve para devolver la notificación.
        return [
            // Esta línea sirve para usar como título el nombre de quien envió.
            'title' => $this->message->sender->name,
            // Esta línea sirve para usar como texto el mensaje recortado a 140 caracteres.
            'body' => str($this->message->body)->limit(140)->toString(),
            // Esta línea sirve para incluir el id de la conversación para abrirla.
            'data' => ['conversation_id' => $this->message->conversation_id],
        ];
    }
}
