<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del feed.

namespace App\Application\Feed\Actions;

// Esta línea sirve para importar el modelo NewsPromotion (novedades y promociones).
use App\Models\NewsPromotion;
// Esta línea sirve para importar el modelo que registra qué novedades leyó cada usuario.
use App\Models\NewsPromotionRead;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase Collection para el tipo de retorno.
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
// Esta línea sirve para declarar la acción que arma el feed unificado del usuario.
class GetUnifiedFeedAction
{
    // Esta línea sirve para definir el máximo de elementos que se traen de cada fuente.
    private const LIMIT_PER_SOURCE = 50;

    /**
     * @return array{data: Collection<int, array<string, mixed>>, meta: array{unread_count: int}}
     */
    // Esta línea sirve para declarar el método que recibe al usuario y devuelve su feed.
    public function execute(User $user): array
    {
        // Esta línea sirve para consultar las novedades.
        $news = NewsPromotion::query()
            // Esta línea sirve para quedarse solo con las publicadas.
            ->published()
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->orderByDesc('published_at')
            // Esta línea sirve para limitar la cantidad de novedades.
            ->limit(self::LIMIT_PER_SOURCE)
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para consultar las novedades que el usuario ya leyó.
        $readAtByNewsId = NewsPromotionRead::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para obtener la fecha de lectura indexada por el id de la novedad.
            ->pluck('read_at', 'news_promotion_id');

        // Esta línea sirve para transformar cada novedad en un elemento del feed.
        $newsItems = $news->map(function (NewsPromotion $item) use ($readAtByNewsId) {
            // Esta línea sirve para obtener cuándo leyó el usuario esa novedad (o null).
            $readAt = $readAtByNewsId->get($item->id);

            // Esta línea sirve para devolver el elemento del feed.
            return [
                // Esta línea sirve para marcar el elemento como novedad.
                'feed_type' => 'news',
                // Esta línea sirve para guardar el id como texto.
                'id' => (string) $item->id,
                // Esta línea sirve para guardar el título.
                'title' => $item->title,
                // Esta línea sirve para guardar el cuerpo.
                'body' => $item->body,
                // Esta línea sirve para guardar la imagen.
                'image_url' => $item->image_url,
                // Esta línea sirve para dejar vacío el tipo de notificación.
                'kind' => null,
                // Esta línea sirve para dejar vacíos los datos de notificación.
                'data' => null,
                // Esta línea sirve para guardar la fecha de lectura en formato ISO, si la hay.
                'read_at' => $readAt?->toIso8601String(),
                // Esta línea sirve para guardar la fecha de publicación en formato ISO.
                'created_at' => $item->published_at->toIso8601String(),
            ];
        });

        // Esta línea sirve para obtener las notificaciones del usuario con el mismo límite.
        $notifications = $user->notifications()->limit(self::LIMIT_PER_SOURCE)->get();

        // Esta línea sirve para transformar cada notificación en un elemento del feed.
        $notificationItems = $notifications->map(fn ($notification) => [
            // Esta línea sirve para marcar el elemento como notificación.
            'feed_type' => 'notification',
            // Esta línea sirve para guardar el id como texto.
            'id' => (string) $notification->id,
            // Esta línea sirve para dejar vacío el título.
            'title' => null,
            // Esta línea sirve para dejar vacío el cuerpo.
            'body' => null,
            // Esta línea sirve para dejar vacía la imagen.
            'image_url' => null,
            // Esta línea sirve para guardar el tipo de notificación (nombre corto de la clase).
            'kind' => class_basename($notification->type),
            // Esta línea sirve para guardar los datos de la notificación.
            'data' => $notification->data,
            // Esta línea sirve para guardar la fecha de lectura en formato ISO, si la hay.
            'read_at' => $notification->read_at?->toIso8601String(),
            // Esta línea sirve para guardar la fecha de creación en formato ISO.
            'created_at' => $notification->created_at->toIso8601String(),
        ]);

        // Esta línea sirve para unir novedades y notificaciones, ordenar por fecha y reindexar.
        $items = $newsItems->concat($notificationItems)->sortByDesc('created_at')->values();

        // Esta línea sirve para contar cuántos elementos no leídos hay en total.
        $unreadCount = $newsItems->whereNull('read_at')->count() + $notificationItems->whereNull('read_at')->count();

        // Esta línea sirve para devolver el feed.
        return [
            // Esta línea sirve para incluir la lista de elementos.
            'data' => $items,
            // Esta línea sirve para incluir la cantidad de no leídos.
            'meta' => ['unread_count' => $unreadCount],
        ];
    }
}
