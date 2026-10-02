<?php

namespace App\Notifications\Concerns;

use App\Models\PushDeviceToken;
use App\Models\PushSubscription;
use App\Models\User;
use App\Notifications\Channels\ExpoPushChannel;
use App\Notifications\Channels\WebPushChannel;
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
trait SendsInAppAndPush
{
    /**
     * @return array{title: string, body: string, link: string}&array<string, mixed>
     */
    abstract protected function payload(User $notifiable): array;

    /**
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $channels = ['database', 'broadcast'];

        if (PushDeviceToken::query()->where('user_id', $notifiable->id)->exists()) {
            $channels[] = ExpoPushChannel::class;
        }

        if (PushSubscription::query()->where('user_id', $notifiable->id)->exists()) {
            $channels[] = WebPushChannel::class;
        }

        return $channels;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        return $this->payload($notifiable);
    }

    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->payload($notifiable));
    }

    /**
     * @return array{title: string, body: string, data: array<string, mixed>}
     */
    public function toExpoPush(User $notifiable): array
    {
        $payload = $this->payload($notifiable);

        return ['title' => $payload['title'], 'body' => $payload['body'], 'data' => $payload];
    }

    /**
     * @return array{title: string, body: string, data: array<string, mixed>}
     */
    public function toWebPush(User $notifiable): array
    {
        return $this->toExpoPush($notifiable);
    }
}
