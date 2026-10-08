<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Edición básica de datos de contacto de un usuario desde el panel admin.
 * A propósito NO incluye `role` (tiene su propio endpoint más restringido,
 * ChangeUserRoleRequest) ni `password` (eso pasa por el flujo de
 * recuperación de contraseña, nunca por un admin editando directo).
 */
// Esta línea sirve para declarar la validación para editar los datos de un usuario.
class UpdateUserRequest extends FormRequest
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
            // Esta línea sirve para permitir opcionalmente el nombre (hasta 255 caracteres).
            'name' => ['sometimes', 'string', 'max:255'],
            // Esta línea sirve para validar el correo.
            'email' => [
                // Esta línea sirve para permitir que falte, y si viene exigir un correo válido de hasta 255 caracteres.
                'sometimes', 'string', 'email', 'max:255',
                // Esta línea sirve para exigir que el correo no lo use otro usuario.
                Rule::unique('users', 'email')->ignore($this->route('user')),
            ],
        ];
    }
}
