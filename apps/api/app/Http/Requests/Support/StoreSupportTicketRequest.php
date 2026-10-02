<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'subject' => is_string($this->subject) ? trim($this->subject) : $this->subject,
            'message' => is_string($this->message) ? trim($this->message) : $this->message,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(config('support.ticket_types'))],
            'subject' => ['required', 'string', 'min:3', 'max:150'],
            'message' => ['required', 'string', 'min:3', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Elige el tipo de solicitud.',
            'type.in' => 'Tipo de solicitud no válido.',
            'subject.required' => 'Escribe un asunto.',
            'subject.min' => 'El asunto es demasiado corto.',
            'subject.max' => 'El asunto no puede superar los 150 caracteres.',
            'message.required' => 'Escribe tu mensaje.',
            'message.min' => 'El mensaje es demasiado corto.',
            'message.max' => 'El mensaje no puede superar los 5000 caracteres.',
        ];
    }
}
