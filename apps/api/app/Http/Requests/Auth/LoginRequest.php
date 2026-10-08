<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación del login.
class LoginRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (cualquiera puede intentar iniciar sesión).
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
            // Esta línea sirve para exigir un correo válido.
            'email' => ['required', 'string', 'email'],
            // Esta línea sirve para exigir la contraseña.
            'password' => ['required', 'string'],
            // Esta línea sirve para permitir opcionalmente el nombre del dispositivo (hasta 255 caracteres).
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
