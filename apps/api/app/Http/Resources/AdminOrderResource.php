<?php

namespace App\Http\Resources;

use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
use App\Models\Order;
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
class AdminOrderResource extends OrderResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->baseFields(),
            'admin_notes' => $this->admin_notes,
            'whatsapp_url' => app(OrderWhatsAppMessageBuilder::class)->buildCustomerUrl($this->resource),
            'history' => AuditLogResource::collection($this->whenLoaded('activities')),
        ];
    }
}
