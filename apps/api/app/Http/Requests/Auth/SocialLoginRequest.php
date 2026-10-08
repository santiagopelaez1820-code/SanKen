<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de autenticación.

namespace App\Http\Requests\Auth;

// Esta línea sirve para importar el trait con las reglas de consentimientos legales.
use App\Http\Requests\Concerns\ValidatesLegalConsents;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación del login con Google.
class SocialLoginRequest extends FormRequest
{
    // Esta línea sirve para usar las reglas y mensajes de consentimientos legales.
    use ValidatesLegalConsents;

    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (cualquiera puede intentar iniciar sesión).
        return true;
    }

    /**
     * `provider` solo acepta 'google' por ahora — Facebook requiere que la
     * app esté verificada como negocio en Meta para permitir login público,
     * lo cual no aplica a este proyecto (ver historial de esta ronda).
     *
     * Las casillas `accept_*` son opcionales acá: una cuenta que YA existe
     * inicia sesión sin mandarlas. Solo si el login fuera a CREAR una cuenta
     * nueva y faltan, SocialLoginAction responde requires_consent en vez de
     * crearla.
     *
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir el token de identidad que entrega Google.
            'id_token' => ['required', 'string'],
            // Esta línea sirve para exigir que el proveedor sea "google".
            'provider' => ['required', 'string', Rule::in(['google'])],
            // Esta línea sirve para permitir opcionalmente el nombre del dispositivo (hasta 255 caracteres).
            'device_name' => ['nullable', 'string', 'max:255'],
            // Esta línea sirve para agregar las casillas legales como opcionales.
            ...$this->legalConsentRules(required: false),
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

    /**
     * @return list<string>
     */
    // Esta línea sirve para declarar el método que devuelve los consentimientos aceptados.
    public function acceptedConsentTypes(): array
    {
        // Esta línea sirve para empezar con la lista vacía.
        $accepted = [];

        // Esta línea sirve para recorrer los datos validados.
        foreach ($this->validated() as $key => $value) {
            // Esta línea sirve para revisar si es una casilla "accept_" marcada.
            if (str_starts_with($key, 'accept_') && $value) {
                // Esta línea sirve para agregar el tipo de consentimiento (sin el prefijo "accept_").
                $accepted[] = substr($key, strlen('accept_'));
            }
        }

        // Esta línea sirve para devolver la lista de consentimientos aceptados.
        return $accepted;
    }
}
