<?php

namespace App\Http\Requests\Admin;

use App\Domain\Order\OrderStatusCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * PATCH /admin/orders/{order} — reemplaza al viejo UpdateOrderStatusRequest
 * (solo status) ahora que el mismo botón "Guardar cambios" del panel admin
 * actualiza status + seguimiento + mensajes en un solo request. Todos los
 * campos son "sometimes": el formulario del panel siempre manda el estado
 * actual completo, pero nada obliga a tocar todos los campos a la vez.
 */
class UpdateOrderTrackingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'string', Rule::in(OrderStatusCatalog::STATUSES)],
            'tracking_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'carrier' => ['sometimes', 'nullable', 'string', 'max:100'],
            'customer_message' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'admin_notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
