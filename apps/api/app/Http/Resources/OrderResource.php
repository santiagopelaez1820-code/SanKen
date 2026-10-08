<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el servicio que arma los enlaces de WhatsApp de los pedidos.
use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Vista del propio cliente — a propósito NUNCA expone `admin_notes` ni el
 * link de WhatsApp hacia el cliente (ese es para que lo use el superadmin,
 * ver AdminOrderResource). Sí expone tracking/carrier/customer_message:
 * esos están pensados para que el cliente los vea en "Mis pedidos".
 *
 * @mixin Order
 */
// Esta línea sirve para declarar el resource que da formato a un pedido para el cliente.
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el pedido en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para copiar los campos comunes del pedido.
            ...$this->baseFields(),
            // Esta línea sirve para incluir el enlace de WhatsApp para escribirle a soporte.
            'support_whatsapp_url' => app(OrderWhatsAppMessageBuilder::class)->buildSupportUrl($this->resource),
        ];
    }

    /**
     * Campos comunes a esta vista y a AdminOrderResource (que extiende esta
     * clase) — antes cada una repetía el mismo mapeo de ~18 campos por
     * separado, con el riesgo de que un campo nuevo se agregara en una vista
     * y se olvidara en la otra.
     *
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que arma los campos comunes de las dos vistas del pedido.
    protected function baseFields(): array
    {
        // Esta línea sirve para devolver los campos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el id del usuario.
            'user_id' => $this->user_id,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir el nombre del cliente.
            'customer_name' => $this->customer_name,
            // Esta línea sirve para incluir el correo del cliente.
            'customer_email' => $this->customer_email,
            // Esta línea sirve para incluir el celular del cliente.
            'customer_phone' => $this->customer_phone,
            // Esta línea sirve para incluir el WhatsApp del cliente.
            'customer_whatsapp' => $this->customer_whatsapp,
            // Esta línea sirve para incluir el departamento.
            'department' => $this->department,
            // Esta línea sirve para incluir la ciudad.
            'city' => $this->city,
            // Esta línea sirve para incluir la dirección.
            'address' => $this->address,
            // Esta línea sirve para incluir la información adicional.
            'additional_info' => $this->additional_info,
            // Esta línea sirve para incluir el subtotal.
            'subtotal' => $this->subtotal,
            // Esta línea sirve para incluir el costo de envío.
            'shipping_cost' => $this->shipping_cost,
            // Esta línea sirve para incluir el total.
            'total' => $this->total,
            // Esta línea sirve para incluir el número de guía.
            'tracking_number' => $this->tracking_number,
            // Esta línea sirve para incluir la transportadora.
            'carrier' => $this->carrier,
            // Esta línea sirve para incluir el mensaje para el cliente.
            'customer_message' => $this->customer_message,
            // Esta línea sirve para incluir los productos solo si se cargaron.
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
            // Esta línea sirve para incluir la fecha de la última actualización en formato ISO 8601.
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
