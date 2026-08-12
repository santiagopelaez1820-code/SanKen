<?php

namespace App\Notifications;

use App\Models\ChatMessage;
use App\Models\PushDeviceToken;
use App\Models\PushSubscription;
use App\Models\User;
use App\Notifications\Channels\ExpoPushChannel;
use App\Notifications\Channels\WebPushChannel;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * No implementa ShouldQueue a propósito: tiene que llegar al centro de
 * notificaciones/badge en el mismo request que el mensaje, sin depender de
 * que queue:work esté corriendo — mismo motivo que MessageSent
 * (ShouldBroadcastNow) y ChallengeProgressUpdated en Sprint 10.
 */
class NewChatMessageNotification extends Notification
{
    public function __construct(
        public readonly ChatMessage $message,
    ) {}

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
     * @return array{conversation_id: int, sender_name: string, body: string}
     */
    public function toArray(User $notifiable): array
    {
        return [
            'conversation_id' => $this->message->conversation_id,
            'sender_name' => $this->message->sender->name,
            'body' => str($this->message->body)->limit(140)->toString(),
        ];
    }

    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }

    /**
     * @return array{title: string, body: string, data: array{conversation_id: int}}
     */
    public function toExpoPush(User $notifiable): array
    {
        return [
            'title' => $this->message->sender->name,
            'body' => str($this->message->body)->limit(140)->toString(),
            'data' => ['conversation_id' => $this->message->conversation_id],
        ];
    }

    /**
     * @return array{title: string, body: string, data: array{conversation_id: int}}
     */
    public function toWebPush(User $notifiable): array
    {
        return [
            'title' => $this->message->sender->name,
            'body' => str($this->message->body)->limit(140)->toString(),
            'data' => ['conversation_id' => $this->message->conversation_id],
        ];
    }
}
