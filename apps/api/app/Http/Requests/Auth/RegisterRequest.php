<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\Concerns\ValidatesLegalConsents;
use App\Rules\PhoneFormat;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    use ValidatesLegalConsents;

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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            // Mismo formato que StoreOrderRequest (ver App\Rules\PhoneFormat) —
            // antes solo tenía 'max:32', así que algo como "-------" pasaba
            // el registro pero era rechazado al hacer un pedido con el mismo
            // valor de teléfono.
            'phone' => ['nullable', 'string', 'max:32', 'regex:'.PhoneFormat::REGEX],
            // Sin estas casillas aceptadas no se crea la cuenta — ver config/legal.php.
            ...$this->legalConsentRules(required: true),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return $this->legalConsentMessages();
    }
}
