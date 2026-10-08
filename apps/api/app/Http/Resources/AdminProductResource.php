<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Product (producto) para tipar el resource.
use App\Models\Product;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Product */
// Esta línea sirve para declarar el resource que da formato a un producto para el admin.
class AdminProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el producto en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir el slug (nombre para la URL).
            'slug' => $this->slug,
            // Esta línea sirve para incluir la descripción.
            'description' => $this->description,
            // Esta línea sirve para incluir la descripción corta.
            'short_description' => $this->short_description,
            // Esta línea sirve para incluir la imagen.
            'image' => $this->image,
            // Esta línea sirve para incluir la categoría.
            'category' => $this->category,
            // Esta línea sirve para incluir el precio.
            'price' => $this->price,
            // Esta línea sirve para indicar si está activo.
            'active' => $this->active,
            // Esta línea sirve para incluir la referencia del proveedor Dropi.
            'dropi_reference' => $this->dropi_reference,
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
