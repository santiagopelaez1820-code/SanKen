<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SocialLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * `provider` solo acepta 'google' por ahora — Facebook requiere que la
     * app esté verificada como negocio en Meta para permitir login público,
     * lo cual no aplica a este proyecto (ver historial de esta ronda).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id_token' => ['required', 'string'],
            'provider' => ['required', 'string', Rule::in(['google'])],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
