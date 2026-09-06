<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Edición básica de datos de contacto de un usuario desde el panel admin.
 * A propósito NO incluye `role` (tiene su propio endpoint más restringido,
 * ChangeUserRoleRequest) ni `password` (eso pasa por el flujo de
 * recuperación de contraseña, nunca por un admin editando directo).
 */
class UpdateUserRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes', 'string', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($this->route('user')),
            ],
        ];
    }
}
