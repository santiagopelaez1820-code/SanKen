<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo NewsPromotion (noticia o promoción) para tipar el resource.
use App\Models\NewsPromotion;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NewsPromotion */
// Esta línea sirve para declarar el resource que da formato a una noticia o promoción.
class NewsPromotionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la noticia en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el título.
            'title' => $this->title,
            // Esta línea sirve para incluir el cuerpo.
            'body' => $this->body,
            // Esta línea sirve para incluir la URL de la imagen.
            'image_url' => $this->image_url,
            // Esta línea sirve para indicar si está publicada.
            'published' => $this->published_at !== null,
            // Esta línea sirve para incluir la fecha de publicación en formato ISO 8601 (o null).
            'published_at' => $this->published_at?->toIso8601String(),
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
