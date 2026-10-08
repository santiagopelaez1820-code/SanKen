<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los canales de notificación.

namespace App\Notifications\Channels;

// Esta línea sirve para importar el modelo PushSubscription (suscripción de un navegador).
use App\Models\PushSubscription;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;
// Esta línea sirve para importar el tipo de cifrado del contenido de Web Push.
use Minishlink\WebPush\ContentEncoding;
// Esta línea sirve para importar la clase que representa una suscripción de Web Push.
use Minishlink\WebPush\Subscription;
// Esta línea sirve para importar el cliente de Web Push.
use Minishlink\WebPush\WebPush;

/**
 * Canal custom de notificaciones (Laravel no trae uno para web push). Usa
 * aes128gcm (RFC 8291) a propósito: el default de la librería es "aesgcm",
 * documentado ahí mismo como "outdated, no recomendado" — los navegadores
 * actuales esperan aes128gcm.
 */
// Esta línea sirve para declarar el canal que envía notificaciones Web Push a los navegadores.
class WebPushChannel
{
    // Esta línea sirve para declarar el método que envía una notificación a un usuario.
    public function send(User $notifiable, Notification $notification): void
    {
        // Esta línea sirve para revisar si la notificación no sabe armarse para Web Push.
        if (! method_exists($notification, 'toWebPush')) {
            // Esta línea sirve para terminar sin enviar nada.
            return;
        }

        // Esta línea sirve para obtener las suscripciones del usuario.
        $subscriptions = PushSubscription::query()->where('user_id', $notifiable->id)->get();
        // Esta línea sirve para revisar si no tiene ninguna.
        if ($subscriptions->isEmpty()) {
            // Esta línea sirve para terminar sin enviar nada.
            return;
        }

        // Esta línea sirve para crear el cliente de Web Push.
        $webPush = new WebPush([
            // Esta línea sirve para configurar las claves VAPID.
            'VAPID' => [
                // Esta línea sirve para pasar el contacto del remitente.
                'subject' => config('webpush.subject'),
                // Esta línea sirve para pasar la clave pública.
                'publicKey' => config('webpush.public_key'),
                // Esta línea sirve para pasar la clave privada.
                'privateKey' => config('webpush.private_key'),
            ],
        ]);

        // Esta línea sirve para convertir el contenido de la notificación a JSON.
        $payload = json_encode($notification->toWebPush($notifiable));

        // Esta línea sirve para recorrer las suscripciones.
        foreach ($subscriptions as $subscription) {
            // Esta línea sirve para encolar una notificación.
            $webPush->queueNotification(
                // Esta línea sirve para crear la suscripción del navegador.
                Subscription::create([
                    // Esta línea sirve para pasar el endpoint.
                    'endpoint' => $subscription->endpoint,
                    // Esta línea sirve para pasar la clave pública del navegador.
                    'publicKey' => $subscription->public_key,
                    // Esta línea sirve para pasar el token de autenticación.
                    'authToken' => $subscription->auth_token,
                    // Esta línea sirve para usar el cifrado aes128gcm.
                    'contentEncoding' => ContentEncoding::aes128gcm,
                ]),
                // Esta línea sirve para pasar el contenido.
                $payload,
            );
        }

        // Esta línea sirve para enviar todas las notificaciones y recorrer los resultados.
        foreach ($webPush->flush() as $report) {
            // Suscripción vencida/inválida (usuario revocó el permiso, browser
            // la descartó, etc.) — se limpia sola en vez de reintentar para
            // siempre en cada notificación futura.
            // Esta línea sirve para revisar si falló porque la suscripción venció.
            if (! $report->isSuccess() && $report->isSubscriptionExpired()) {
                // Esta línea sirve para borrar la suscripción vencida.
                PushSubscription::query()->where('endpoint', $report->getEndpoint())->delete();
            }
        }
    }
}
