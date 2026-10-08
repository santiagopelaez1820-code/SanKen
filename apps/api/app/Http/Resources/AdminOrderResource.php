<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el servicio que arma los enlaces de WhatsApp de los pedidos.
use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

/**
 * Vista del superadmin — todo lo de OrderResource (que extiende, ver
 * OrderResource::baseFields()) más `admin_notes` (nunca visible para el
 * cliente), el link de WhatsApp HACIA el cliente ya armado según el estado
 * actual, y el historial de cambios (reutiliza AuditLogResource, igual
 * formato que /admin/audit-logs — mismo Spatie Activitylog, no una tabla de
 * historial aparte).
 *
 * @mixin Order
 */
// Esta línea sirve para declarar el resource que da formato a un pedido para el admin (extiende el del cliente).
class AdminOrderResource extends OrderResource
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
            // Esta línea sirve para incluir las notas internas del admin.
            'admin_notes' => $this->admin_notes,
            // Esta línea sirve para incluir el enlace de WhatsApp para escribirle al cliente.
            'whatsapp_url' => app(OrderWhatsAppMessageBuilder::class)->buildCustomerUrl($this->resource),
            // Esta línea sirve para incluir el historial de cambios si se cargó.
            'history' => AuditLogResource::collection($this->whenLoaded('activities')),
        ];
    }
}
