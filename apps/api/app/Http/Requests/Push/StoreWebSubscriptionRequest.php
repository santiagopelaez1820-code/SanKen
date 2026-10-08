<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de notificaciones push.

namespace App\Http\Requests\Push;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

/**
 * Acepta la forma cruda de PushSubscription.toJSON() del navegador
 * (endpoint + keys.p256dh + keys.auth), sin aplanar del lado del cliente.
 */
// Esta línea sirve para declarar la validación del registro de una suscripción Web Push.
class StoreWebSubscriptionRequest extends FormRequest
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
            // Esta línea sirve para exigir el endpoint del navegador (hasta 500 caracteres).
            'endpoint' => ['required', 'string', 'max:500'],
            // Esta línea sirve para exigir la clave pública p256dh.
            'keys.p256dh' => ['required', 'string'],
            // Esta línea sirve para exigir la clave de autenticación.
            'keys.auth' => ['required', 'string'],
        ];
    }
}
