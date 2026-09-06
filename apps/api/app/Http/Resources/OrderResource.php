<?php

namespace App\Http\Resources;

use App\Domain\Order\Services\OrderWhatsAppMessageBuilder;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Vista del propio cliente — a propósito NUNCA expone `admin_notes` ni el
 * link de WhatsApp hacia el cliente (ese es para que lo use el superadmin,
 * ver AdminOrderResource). Sí expone tracking/carrier/customer_message:
 * esos están pensados para que el cliente los vea en "Mis pedidos".
 *
 * @mixin Order
 */
class OrderResource extends JsonResource
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
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            'support_whatsapp_url' => app(OrderWhatsAppMessageBuilder::class)->buildSupportUrl($this->resource),
        ];
    }
}
