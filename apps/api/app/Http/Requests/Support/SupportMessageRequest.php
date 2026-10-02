<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;

/** Un mensaje en la conversación de una solicitud (usuario o equipo). */
class SupportMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['body' => is_string($this->body) ? trim($this->body) : $this->body]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'min:1', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'body.required' => 'Escribe un mensaje.',
            'body.max' => 'El mensaje no puede superar los 5000 caracteres.',
        ];
    }
}
