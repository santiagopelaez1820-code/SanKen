<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación del cambio de rol de un usuario.
class ChangeUserRoleRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
        return true;
    }

    /**
     * Solo 'user'/'trainer' son destinos válidos — 'super_admin' queda
     * deliberadamente afuera para que ningún request (manipulado o no)
     * pueda auto-promocionarse ni promocionar a otra cuenta a Super Admin
     * por esta vía.
     *
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir que el rol nuevo sea "user" o "trainer".
            'role' => ['required', 'string', Rule::in(['user', 'trainer'])],
        ];
    }
}
