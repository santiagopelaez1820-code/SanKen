<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar el catálogo de estados de pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * PATCH /admin/orders/{order} — reemplaza al viejo UpdateOrderStatusRequest
 * (solo status) ahora que el mismo botón "Guardar cambios" del panel admin
 * actualiza status + seguimiento + mensajes en un solo request. Todos los
 * campos son "sometimes": el formulario del panel siempre manda el estado
 * actual completo, pero nada obliga a tocar todos los campos a la vez.
 */
// Esta línea sirve para declarar la validación para actualizar el estado y el seguimiento de un pedido.
class UpdateOrderTrackingRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para permitir opcionalmente un estado válido del catálogo.
            'status' => ['sometimes', 'string', Rule::in(OrderStatusCatalog::STATUSES)],
            // Esta línea sirve para permitir opcionalmente el número de guía (hasta 100 caracteres).
            'tracking_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            // Esta línea sirve para permitir opcionalmente la transportadora (hasta 100 caracteres).
            'carrier' => ['sometimes', 'nullable', 'string', 'max:100'],
            // Esta línea sirve para permitir opcionalmente un mensaje para el cliente (hasta 1000 caracteres).
            'customer_message' => ['sometimes', 'nullable', 'string', 'max:1000'],
            // Esta línea sirve para permitir opcionalmente notas internas del admin (hasta 2000 caracteres).
            'admin_notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
