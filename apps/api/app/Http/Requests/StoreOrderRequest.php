<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * El precio y el nombre de cada producto NUNCA se aceptan acá — solo
 * product_id + quantity. CreateOrderAction relee el producto real desde la
 * base de datos para calcular subtotal/total (ver seguridad #15 del pedido
 * original: nunca confiar en el precio que manda el cliente).
 */
class StoreOrderRequest extends FormRequest
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
            'customer_name' => ['required', 'string', 'max:150'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'department' => ['required', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:150'],
            'address' => ['required', 'string', 'max:255'],
            'additional_info' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
