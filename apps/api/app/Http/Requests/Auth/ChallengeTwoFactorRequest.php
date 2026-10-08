<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación del segundo paso del login con verificación en dos pasos.
class ChallengeTwoFactorRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (es parte del login, todavía sin sesión).
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
            // Esta línea sirve para exigir el token temporal que devolvió el primer paso del login.
            'challenge_token' => ['required', 'string'],
            // Esta línea sirve para exigir el código de verificación en dos pasos.
            'code' => ['required', 'string'],
            // Esta línea sirve para permitir opcionalmente el nombre del dispositivo (hasta 255 caracteres).
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
