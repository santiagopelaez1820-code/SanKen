<?php

namespace App\Application\Feed\Actions;

use App\Models\NewsPromotion;
use App\Models\NewsPromotionRead;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Combina Novedades (NewsPromotion, contenido publicado por admins) y
 * Notificaciones (tabla nativa de Laravel, hoy solo NewChatMessageNotification)
 * en un único feed cronológico -- antes eran dos pantallas separadas sin
 * relación entre sí. Volumen esperado bajo (novedades son poco frecuentes,
 * notificaciones son mensajes de chat), así que no hace falta paginación
 * cruzada entre las dos fuentes: se trae un tope razonable de cada una y se
 * mezcla en memoria.
 */
class GetUnifiedFeedAction
{
    private const LIMIT_PER_SOURCE = 50;

    /**
     * @return array{data: Collection<int, array<string, mixed>>, meta: array{unread_count: int}}
     */
    public function execute(User $user): array
    {
        $news = NewsPromotion::query()
            ->published()
            ->orderByDesc('published_at')
            ->limit(self::LIMIT_PER_SOURCE)
            ->get();

        $readAtByNewsId = NewsPromotionRead::query()
            ->where('user_id', $user->id)
            ->pluck('read_at', 'news_promotion_id');

        $newsItems = $news->map(function (NewsPromotion $item) use ($readAtByNewsId) {
            $readAt = $readAtByNewsId->get($item->id);

            return [
                'feed_type' => 'news',
                'id' => (string) $item->id,
                'title' => $item->title,
                'body' => $item->body,
                'image_url' => $item->image_url,
                'kind' => null,
                'data' => null,
                'read_at' => $readAt?->toIso8601String(),
                'created_at' => $item->published_at->toIso8601String(),
            ];
        });

        $notifications = $user->notifications()->limit(self::LIMIT_PER_SOURCE)->get();

        $notificationItems = $notifications->map(fn ($notification) => [
            'feed_type' => 'notification',
            'id' => (string) $notification->id,
            'title' => null,
            'body' => null,
            'image_url' => null,
            'kind' => class_basename($notification->type),
            'data' => $notification->data,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at->toIso8601String(),
        ]);

        $items = $newsItems->concat($notificationItems)->sortByDesc('created_at')->values();

        $unreadCount = $newsItems->whereNull('read_at')->count() + $notificationItems->whereNull('read_at')->count();

        return [
            'data' => $items,
            'meta' => ['unread_count' => $unreadCount],
        ];
    }
}
