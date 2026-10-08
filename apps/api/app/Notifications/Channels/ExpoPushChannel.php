<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los canales de notificación.

namespace App\Notifications\Channels;

// Esta línea sirve para importar el modelo PushDeviceToken (token de un celular).
use App\Models\PushDeviceToken;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;
// Esta línea sirve para importar la fachada Http para hacer peticiones HTTP.
use Illuminate\Support\Facades\Http;

/**
 * Canal custom de notificaciones (Laravel no trae uno para Expo). Se
 * referencia por nombre de clase en el via() de cada Notification — no
 * necesita registrarse en ningún service provider.
 */
// Esta línea sirve para declarar el canal que envía notificaciones push con Expo.
class ExpoPushChannel
{
    // Esta línea sirve para declarar el método que envía una notificación a un usuario.
    public function send(User $notifiable, Notification $notification): void
    {
        // Esta línea sirve para revisar si la notificación no sabe armarse para Expo.
        if (! method_exists($notification, 'toExpoPush')) {
            // Esta línea sirve para terminar sin enviar nada.
            return;
        }

        // Esta línea sirve para obtener los tokens de los celulares del usuario.
        $tokens = PushDeviceToken::query()->where('user_id', $notifiable->id)->pluck('token');
        // Esta línea sirve para revisar si no tiene ningún token.
        if ($tokens->isEmpty()) {
            // Esta línea sirve para terminar sin enviar nada.
            return;
        }

        // Esta línea sirve para armar el contenido de la notificación.
        $payload = $notification->toExpoPush($notifiable);

        // Esta línea sirve para crear un mensaje por cada token con el mismo contenido.
        $messages = $tokens->map(fn (string $token) => [...$payload, 'to' => $token])->values()->all();

        // Esta línea sirve para enviar los mensajes al servicio de push de Expo.
        Http::post('https://exp.host/--/api/v2/push/send', $messages);
    }
}
