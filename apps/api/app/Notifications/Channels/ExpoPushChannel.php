<?php

namespace App\Notifications\Channels;

use App\Models\PushDeviceToken;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

/**
 * Canal custom de notificaciones (Laravel no trae uno para Expo). Se
 * referencia por nombre de clase en el via() de cada Notification — no
 * necesita registrarse en ningún service provider.
 */
class ExpoPushChannel
{
    public function send(User $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toExpoPush')) {
            return;
        }

        $tokens = PushDeviceToken::query()->where('user_id', $notifiable->id)->pluck('token');
        if ($tokens->isEmpty()) {
            return;
        }

        $payload = $notification->toExpoPush($notifiable);

        $messages = $tokens->map(fn (string $token) => [...$payload, 'to' => $token])->values()->all();

        Http::post('https://exp.host/--/api/v2/push/send', $messages);
    }
}
