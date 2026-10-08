<?php

// Esta línea sirve para ubicar este trait en el espacio de nombres de utilidades de las notificaciones.

namespace App\Notifications\Concerns;

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

/**
 * Mismos canales que NewChatMessageNotification: centro de notificaciones
 * (database → feed "Novedades"), tiempo real (broadcast/Reverb) y push solo
 * si el usuario tiene un dispositivo/navegador registrado — quien desactivó
 * las notificaciones igual la ve en Novedades, pero no recibe push.
 *
 * Cada notificación define payload(): `title`, `body` y `link` (ruta
 * compartida por web y mobile, ej. "/soporte/12"). El feed y el service
 * worker usan `link` para abrir la pantalla correcta.
 */
// Esta línea sirve para declarar el trait que envía una notificación a la app y por push.
trait SendsInAppAndPush
{
    /**
     * @return array{title: string, body: string, link: string}&array<string, mixed>
     */
    // Esta línea sirve para declarar el método que cada notificación debe implementar con su contenido.
    abstract protected function payload(User $notifiable): array;

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
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que arma lo que se guarda en la base de datos.
    public function toArray(User $notifiable): array
    {
        // Esta línea sirve para devolver el contenido de la notificación.
        return $this->payload($notifiable);
    }

    // Esta línea sirve para declarar el método que arma el mensaje en tiempo real.
    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        // Esta línea sirve para crear el mensaje con el contenido de la notificación.
        return new BroadcastMessage($this->payload($notifiable));
    }

    /**
     * @return array{title: string, body: string, data: array<string, mixed>}
     */
    // Esta línea sirve para declarar el método que arma la notificación para Expo.
    public function toExpoPush(User $notifiable): array
    {
        // Esta línea sirve para obtener el contenido de la notificación.
        $payload = $this->payload($notifiable);

        // Esta línea sirve para devolver el título, el texto y los datos.
        return ['title' => $payload['title'], 'body' => $payload['body'], 'data' => $payload];
    }

    /**
     * @return array{title: string, body: string, data: array<string, mixed>}
     */
    // Esta línea sirve para declarar el método que arma la notificación para Web Push.
    public function toWebPush(User $notifiable): array
    {
        // Esta línea sirve para reutilizar el mismo formato que Expo.
        return $this->toExpoPush($notifiable);
    }
}
