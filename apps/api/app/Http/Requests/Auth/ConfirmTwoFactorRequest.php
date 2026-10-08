<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación para confirmar la activación de la verificación en dos pasos.
class ConfirmTwoFactorRequest extends FormRequest
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
            // Esta línea sirve para exigir el código de 6 dígitos de la app autenticadora.
            'code' => ['required', 'string', 'size:6'],
        ];
    }
}
