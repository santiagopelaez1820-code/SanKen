<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;

/**
 * Confirmación doble para una acción irreversible: escribir "ELIMINAR" y,
 * si la cuenta se creó con correo y contraseña, la contraseña actual. Las
 * cuentas creadas con Google tienen una contraseña aleatoria que el usuario
 * nunca conoció (ver SocialLoginAction), así que para ellas alcanza con la
 * confirmación escrita + la sesión autenticada.
 */
class DeleteAccountRequest extends FormRequest
{
    public const CONFIRMATION_WORD = 'ELIMINAR';

    public function authorize(): bool
    {
        return true;
    }

    public function requiresPassword(): bool
    {
        return $this->user()->auth_provider === null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'confirmation' => ['required', 'string', 'in:'.self::CONFIRMATION_WORD],
            'password' => [$this->requiresPassword() ? 'required' : 'nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'confirmation.required' => 'Escribe ELIMINAR para confirmar.',
            'confirmation.in' => 'Escribe ELIMINAR para confirmar.',
            'password.required' => 'Ingresa tu contraseña para confirmar.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if (! $this->requiresPassword() || $validator->errors()->has('password')) {
                    return;
                }

                if (! Hash::check((string) $this->input('password'), $this->user()->password)) {
                    $validator->errors()->add('password', 'La contraseña no es correcta.');
                }
            },
        ];
    }
}
