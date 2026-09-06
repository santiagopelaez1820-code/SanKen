<?php

namespace App\Http\Resources;

use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Vista del superadmin — todo lo de OrderResource más `admin_notes` (nunca
 * visible para el cliente), el link de WhatsApp HACIA el cliente ya armado
 * según el estado actual, y el historial de cambios (reutiliza
 * AuditLogResource, igual formato que /admin/audit-logs — mismo
 * Spatie Activitylog, no una tabla de historial aparte).
 *
 * @mixin Order
 */
class AdminOrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'customer_whatsapp' => $this->customer_whatsapp,
            'department' => $this->department,
            'city' => $this->city,
            'address' => $this->address,
            'additional_info' => $this->additional_info,
            'subtotal' => $this->subtotal,
            'shipping_cost' => $this->shipping_cost,
            'total' => $this->total,
            'tracking_number' => $this->tracking_number,
            'carrier' => $this->carrier,
            'customer_message' => $this->customer_message,
            'admin_notes' => $this->admin_notes,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'whatsapp_url' => app(OrderWhatsAppMessageBuilder::class)->buildCustomerUrl($this->resource),
            'history' => AuditLogResource::collection($this->whenLoaded('activities')),
        ];
    }
}
