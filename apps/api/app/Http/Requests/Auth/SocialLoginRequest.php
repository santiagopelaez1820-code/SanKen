<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\Concerns\ValidatesLegalConsents;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SocialLoginRequest extends FormRequest
{
    use ValidatesLegalConsents;

    public function authorize(): bool
    {
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
    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
            'provider' => ['required', 'string', Rule::in(['google'])],
            'device_name' => ['nullable', 'string', 'max:255'],
            ...$this->legalConsentRules(required: false),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return $this->legalConsentMessages();
    }

    /**
     * @return list<string>
     */
    public function acceptedConsentTypes(): array
    {
        $accepted = [];

        foreach ($this->validated() as $key => $value) {
            if (str_starts_with($key, 'accept_') && $value) {
                $accepted[] = substr($key, strlen('accept_'));
            }
        }

        return $accepted;
    }
}
