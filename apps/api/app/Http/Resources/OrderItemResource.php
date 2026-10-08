<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo OrderItem (producto de un pedido) para tipar el resource.
use App\Models\OrderItem;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderItem */
// Esta línea sirve para declarar el resource que da formato a un producto de un pedido.
class OrderItemResource extends JsonResource
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
            // Esta línea sirve para incluir el id del producto.
            'product_id' => $this->product_id,
            // Esta línea sirve para incluir el nombre del producto al momento de la compra.
            'product_name' => $this->product_name,
            // Esta línea sirve para incluir la cantidad.
            'quantity' => $this->quantity,
            // Esta línea sirve para incluir el precio unitario.
            'unit_price' => $this->unit_price,
            // Esta línea sirve para incluir el subtotal.
            'subtotal' => $this->subtotal,
        ];
    }
}
