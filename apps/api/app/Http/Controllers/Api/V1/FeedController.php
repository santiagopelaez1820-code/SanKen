<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que arma el feed unificado.
use App\Application\Feed\Actions\GetUnifiedFeedAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el modelo NewsPromotion (novedades y promociones).
use App\Models\NewsPromotion;
// Esta línea sirve para importar el modelo que registra qué novedades leyó cada usuario.
use App\Models\NewsPromotionRead;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Feed" de Swagger.
#[Group('Feed', 'Novedades del usuario: noticias y promociones publicadas más sus notificaciones.', weight: 17)]
// Esta línea sirve para declarar el controller del feed de novedades.
class FeedController extends Controller
{
    /**
     * Obtener mi feed de novedades.
     *
     * Noticias/promociones publicadas y notificaciones del usuario en una sola
     * lista, cada una con su estado de lectura. `meta.unread_count` cuenta las
     * no leídas. `title`, `body` e `image_url` solo vienen en las novedades;
     * `kind` (tipo de notificación) y `data` (su contenido), solo en las
     * notificaciones.
     *
     * @response array{
     *     data: list<array{
     *         feed_type: 'news'|'notification',
     *         id: string,
     *         title: string|null,
     *         body: string|null,
     *         image_url: string|null,
     *         kind: string|null,
     *         data: array<string, mixed>|null,
     *         read_at: string|null,
     *         created_at: string,
     *     }>,
     *     meta: array{unread_count: int},
     * }
     */
    // Esta línea sirve para declarar el endpoint que devuelve el feed del usuario.
    public function index(Request $request, GetUnifiedFeedAction $action): JsonResponse
    {
        // Esta línea sirve para responder con el feed armado por la acción.
        return response()->json($action->execute($request->user()));
    }

    /**
     * Marcar una novedad como leída.
     *
     * `type` es `news` (noticia/promoción) o `notification`.
     */
    // Esta línea sirve para declarar el endpoint que marca una novedad o notificación como leída.
    public function markRead(Request $request, string $type, string $id): JsonResponse
    {
        // Esta línea sirve para revisar si el elemento es una novedad.
        if ($type === 'news') {
            // Esta línea sirve para buscar la novedad publicada por su id (404 si no existe).
            $news = NewsPromotion::query()->published()->findOrFail($id);
            // Esta línea sirve para registrar la lectura si todavía no existía.
            NewsPromotionRead::query()->firstOrCreate(
                // Esta línea sirve para buscar por usuario y novedad.
                ['user_id' => $request->user()->id, 'news_promotion_id' => $news->id],
                // Esta línea sirve para guardar la fecha de lectura.
                ['read_at' => now()],
            );
            // Esta línea sirve para manejar el caso de una notificación.
        } else {
            // Esta línea sirve para buscar la notificación del usuario y marcarla como leída.
            $request->user()->notifications()->findOrFail($id)->markAsRead();
        }

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }

    /** Marcar todo el feed como leído. */
    // Esta línea sirve para declarar el endpoint que marca todo el feed como leído.
    public function markAllRead(Request $request): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();
        // Esta línea sirve para marcar como leídas todas sus notificaciones pendientes.
        $user->unreadNotifications->markAsRead();

        // Esta línea sirve para obtener los ids de las novedades publicadas.
        $unreadNewsIds = NewsPromotion::query()->published()->pluck('id')
            // Esta línea sirve para quitar las que el usuario ya había leído.
            ->diff(NewsPromotionRead::query()->where('user_id', $user->id)->pluck('news_promotion_id'));

        // Esta línea sirve para guardar la fecha y hora actual.
        $now = now();
        // Esta línea sirve para recorrer las novedades no leídas.
        foreach ($unreadNewsIds as $newsId) {
            // Esta línea sirve para registrar la lectura de cada una.
            NewsPromotionRead::query()->create(['user_id' => $user->id, 'news_promotion_id' => $newsId, 'read_at' => $now]);
        }

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }
}
