<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de una noticia.
use App\Http\Requests\Admin\NewsPromotionRequest;
// Esta línea sirve para importar el resource que da formato a una noticia.
use App\Http\Resources\NewsPromotionResource;
// Esta línea sirve para importar el modelo NewsPromotion (noticia o promoción).
use App\Models\NewsPromotion;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;

// Esta línea sirve para agrupar este controller en la sección "Admin · Noticias y promociones" de Swagger.
#[Group('Admin · Noticias y promociones', 'Noticias y promociones que aparecen en el feed de los usuarios una vez publicadas.', weight: 30)]
// Esta línea sirve para declarar el controller de noticias y promociones.
class AdminNewsController extends Controller
{
    /**
     * Listar noticias y promociones.
     *
     * A diferencia de NewsController::index (público, solo publicadas),
     * acá se listan también los borradores.
     */
    // Esta línea sirve para declarar el endpoint que lista las noticias.
    public function index(): JsonResponse
    {
        // Esta línea sirve para obtener todas las noticias de la más reciente a la más antigua.
        $news = NewsPromotion::query()->orderByDesc('created_at')->get();

        // Esta línea sirve para responder con las noticias.
        return response()->json(['data' => NewsPromotionResource::collection($news)]);
    }

    /**
     * Crear una noticia o promoción.
     *
     * Con `published: true` se publica de inmediato; si no, queda como
     * borrador.
     */
    // Esta línea sirve para declarar el endpoint que crea una noticia.
    public function store(NewsPromotionRequest $request): JsonResponse
    {
        // Esta línea sirve para crear la noticia.
        $news = NewsPromotion::query()->create([
            // Esta línea sirve para guardar el admin que la creó.
            'admin_id' => $request->user()->id,
            // Esta línea sirve para guardar el título.
            'title' => $request->validated('title'),
            // Esta línea sirve para guardar el cuerpo.
            'body' => $request->validated('body'),
            // Esta línea sirve para guardar la imagen.
            'image_url' => $request->validated('image_url'),
            // Esta línea sirve para publicarla ahora si se pidió, si no dejarla como borrador.
            'published_at' => $request->boolean('published') ? now() : null,
        ]);

        // Esta línea sirve para responder con la noticia creada y código 201.
        return response()->json(['data' => new NewsPromotionResource($news)], 201);
    }

    /**
     * Editar una noticia o promoción.
     *
     * `published` publica (conservando la fecha original si ya lo estaba) o
     * la vuelve borrador.
     */
    // Esta línea sirve para declarar el endpoint que edita una noticia.
    public function update(NewsPromotionRequest $request, NewsPromotion $news): JsonResponse
    {
        // Esta línea sirve para actualizar solo título, cuerpo e imagen.
        $news->fill($request->only(['title', 'body', 'image_url']));

        // Esta línea sirve para revisar si se envió el campo published.
        if ($request->has('published')) {
            // Esta línea sirve para publicarla (conservando la fecha) o volverla borrador.
            $news->published_at = $request->boolean('published') ? ($news->published_at ?? now()) : null;
        }

        // Esta línea sirve para guardar los cambios.
        $news->save();

        // Esta línea sirve para responder con la noticia actualizada.
        return response()->json(['data' => new NewsPromotionResource($news)]);
    }

    /** Eliminar una noticia o promoción. */
    // Esta línea sirve para declarar el endpoint que elimina una noticia.
    public function destroy(NewsPromotion $news): JsonResponse
    {
        // Esta línea sirve para borrar la noticia.
        $news->delete();

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }
}
