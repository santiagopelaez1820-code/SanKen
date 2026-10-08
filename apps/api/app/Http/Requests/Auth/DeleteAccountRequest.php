<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar la fachada Hash para comparar la contraseña.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar la clase Validator para agregar errores propios.
use Illuminate\Validation\Validator;

/**
 * Confirmación doble para una acción irreversible: escribir "ELIMINAR" y,
 * si la cuenta se creó con correo y contraseña, la contraseña actual. Las
 * cuentas creadas con Google tienen una contraseña aleatoria que el usuario
 * nunca conoció (ver SocialLoginAction), así que para ellas alcanza con la
 * confirmación escrita + la sesión autenticada.
 */
// Esta línea sirve para declarar la validación de la eliminación de la cuenta.
class DeleteAccountRequest extends FormRequest
{
    // Esta línea sirve para definir la palabra que el usuario debe escribir para confirmar.
    public const CONFIRMATION_WORD = 'ELIMINAR';

    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
        return true;
    }

    // Esta línea sirve para declarar el método que indica si hay que pedir la contraseña.
    public function requiresPassword(): bool
    {
        // `?->`: Scramble evalúa rules() sin usuario autenticado al generar
        // la documentación (en una request real la ruta exige auth:sanctum).
        // Esta línea sirve para pedir la contraseña solo si la cuenta no se creó con Google.
        return $this->user()?->auth_provider === null;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir que se escriba exactamente la palabra de confirmación.
            'confirmation' => ['required', 'string', 'in:'.self::CONFIRMATION_WORD],
            /** Contraseña actual. Obligatoria si la cuenta se creó con correo y contraseña; las cuentas de Google no la necesitan. */
            // Esta línea sirve para exigir la contraseña solo si la cuenta se creó con correo y contraseña.
            'password' => [$this->requiresPassword() ? 'required' : 'nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si falta la confirmación.
            'confirmation.required' => 'Escribe ELIMINAR para confirmar.',
            // Esta línea sirve para definir el mensaje si la confirmación no es la palabra correcta.
            'confirmation.in' => 'Escribe ELIMINAR para confirmar.',
            // Esta línea sirve para definir el mensaje si falta la contraseña.
            'password.required' => 'Ingresa tu contraseña para confirmar.',
        ];
    }

    // Esta línea sirve para declarar las validaciones que se ejecutan después de las reglas.
    public function after(): array
    {
        // Esta línea sirve para devolver la lista de validaciones extra.
        return [
            // Esta línea sirve para definir la validación que comprueba la contraseña.
            function (Validator $validator) {
                // Esta línea sirve para revisar si no hace falta contraseña o si ya tiene otro error.
                if (! $this->requiresPassword() || $validator->errors()->has('password')) {
                    // Esta línea sirve para salir sin revisar nada más.
                    return;
                }

                // Esta línea sirve para comparar la contraseña enviada con la guardada.
                if (! Hash::check((string) $this->input('password'), $this->user()->password)) {
                    // Esta línea sirve para agregar el error de contraseña incorrecta.
                    $validator->errors()->add('password', 'La contraseña no es correcta.');
                }
            },
        ];
    }
}
