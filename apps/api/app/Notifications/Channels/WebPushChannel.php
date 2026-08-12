<?php

namespace App\Notifications\Channels;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Minishlink\WebPush\ContentEncoding;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

/**
 * Canal custom de notificaciones (Laravel no trae uno para web push). Usa
 * aes128gcm (RFC 8291) a propósito: el default de la librería es "aesgcm",
 * documentado ahí mismo como "outdated, no recomendado" — los navegadores
 * actuales esperan aes128gcm.
 */
class WebPushChannel
{
    public function send(User $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toWebPush')) {
            return;
        }

        $subscriptions = PushSubscription::query()->where('user_id', $notifiable->id)->get();
        if ($subscriptions->isEmpty()) {
            return;
        }

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => config('webpush.subject'),
                'publicKey' => config('webpush.public_key'),
                'privateKey' => config('webpush.private_key'),
            ],
        ]);

        $payload = json_encode($notification->toWebPush($notifiable));

        foreach ($subscriptions as $subscription) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'publicKey' => $subscription->public_key,
                    'authToken' => $subscription->auth_token,
                    'contentEncoding' => ContentEncoding::aes128gcm,
                ]),
                $payload,
            );
        }

        foreach ($webPush->flush() as $report) {
            // Suscripción vencida/inválida (usuario revocó el permiso, browser
            // la descartó, etc.) — se limpia sola en vez de reintentar para
            // siempre en cada notificación futura.
            if (! $report->isSuccess() && $report->isSubscriptionExpired()) {
                PushSubscription::query()->where('endpoint', $report->getEndpoint())->delete();
            }
        }
    }
}
