<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones.

namespace App\Http\Requests;

// Esta línea sirve para importar la regla del formato de teléfono.
use App\Rules\PhoneFormat;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

/**
 * El precio y el nombre de cada producto NUNCA se aceptan acá — solo
 * product_id + quantity. CreateOrderAction relee el producto real desde la
 * base de datos para calcular subtotal/total (ver seguridad #15 del pedido
 * original: nunca confiar en el precio que manda el cliente).
 */
// Esta línea sirve para declarar la validación de la creación de un pedido.
class StoreOrderRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
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
            // Esta línea sirve para exigir el nombre del cliente (hasta 150 caracteres).
            'customer_name' => ['required', 'string', 'max:150'],
            // Esta línea sirve para exigir un correo válido.
            'customer_email' => ['required', 'email', 'max:255'],
            // Esta línea sirve para exigir un celular con formato válido.
            'customer_phone' => ['required', 'string', 'max:30', 'regex:'.PhoneFormat::REGEX],
            // El checkbox "mi WhatsApp es el mismo que mi celular" es UX
            // pura del cliente (mobile/web) — acá siempre se exige un valor
            // explícito, ya resuelto por la app antes de enviar el request.
            // Esta línea sirve para exigir un WhatsApp con formato válido.
            'customer_whatsapp' => ['required', 'string', 'max:30', 'regex:'.PhoneFormat::REGEX],
            // Esta línea sirve para exigir el departamento.
            'department' => ['required', 'string', 'max:150'],
            // Esta línea sirve para exigir la ciudad.
            'city' => ['required', 'string', 'max:150'],
            // Esta línea sirve para exigir la dirección.
            'address' => ['required', 'string', 'max:255'],
            // Esta línea sirve para permitir opcionalmente información adicional para la entrega.
            'additional_info' => ['nullable', 'string', 'max:500'],
            // Esta línea sirve para exigir al menos un producto.
            'items' => ['required', 'array', 'min:1'],
            // Esta línea sirve para exigir que cada producto exista.
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            // Esta línea sirve para exigir la cantidad de cada producto entre 1 y 50.
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
