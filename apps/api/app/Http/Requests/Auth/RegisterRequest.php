<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar el trait con las reglas de consentimientos legales.
use App\Http\Requests\Concerns\ValidatesLegalConsents;
// Esta línea sirve para importar la regla del formato de teléfono.
use App\Rules\PhoneFormat;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar la regla de contraseña segura de Laravel.
use Illuminate\Validation\Rules\Password;

// Esta línea sirve para declarar la validación del registro de usuarios.
class RegisterRequest extends FormRequest
{
    // Esta línea sirve para usar las reglas y mensajes de consentimientos legales.
    use ValidatesLegalConsents;

    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (cualquiera puede registrarse).
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
            // Esta línea sirve para exigir el nombre (hasta 255 caracteres).
            'name' => ['required', 'string', 'max:255'],
            // Esta línea sirve para exigir un correo válido que no esté registrado.
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            // Esta línea sirve para exigir una contraseña segura y su confirmación.
            'password' => ['required', 'confirmed', Password::defaults()],
            // Mismo formato que StoreOrderRequest (ver App\Rules\PhoneFormat) —
            // antes solo tenía 'max:32', así que algo como "-------" pasaba
            // el registro pero era rechazado al hacer un pedido con el mismo
            // valor de teléfono.
            // Esta línea sirve para permitir opcionalmente un teléfono con formato válido.
            'phone' => ['nullable', 'string', 'max:32', 'regex:'.PhoneFormat::REGEX],
            // Sin estas casillas aceptadas no se crea la cuenta — ver config/legal.php.
            // Esta línea sirve para agregar las casillas legales obligatorias.
            ...$this->legalConsentRules(required: true),
        ];
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para devolver los mensajes de los consentimientos legales.
        return $this->legalConsentMessages();
    }
}
