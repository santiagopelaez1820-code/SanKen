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
     * `provider` solo acepta 'google' por ahora — Facebook todavía no está
     * implementado, se amplía esta lista cuando lo esté.
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
