<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de soporte.

namespace App\Http\Requests\Support;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación de la creación de una solicitud de soporte.
class StoreSupportTicketRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
        return true;
    }

    // Esta línea sirve para declarar el método que prepara los datos antes de validar.
    protected function prepareForValidation(): void
    {
        // Esta línea sirve para reemplazar los datos por versiones sin espacios sobrantes.
        $this->merge([
            // Esta línea sirve para quitar los espacios al inicio y al final del asunto.
            'subject' => is_string($this->subject) ? trim($this->subject) : $this->subject,
            // Esta línea sirve para quitar los espacios al inicio y al final del mensaje.
            'message' => is_string($this->message) ? trim($this->message) : $this->message,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir un tipo de solicitud de los configurados.
            'type' => ['required', 'string', Rule::in(config('support.ticket_types'))],
            // Esta línea sirve para exigir el asunto (entre 3 y 150 caracteres).
            'subject' => ['required', 'string', 'min:3', 'max:150'],
            // Esta línea sirve para exigir el mensaje (entre 3 y 5000 caracteres).
            'message' => ['required', 'string', 'min:3', 'max:5000'],
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
            // Esta línea sirve para definir el mensaje si falta el tipo.
            'type.required' => 'Elige el tipo de solicitud.',
            // Esta línea sirve para definir el mensaje si el tipo no es válido.
            'type.in' => 'Tipo de solicitud no válido.',
            // Esta línea sirve para definir el mensaje si falta el asunto.
            'subject.required' => 'Escribe un asunto.',
            // Esta línea sirve para definir el mensaje si el asunto es muy corto.
            'subject.min' => 'El asunto es demasiado corto.',
            // Esta línea sirve para definir el mensaje si el asunto es muy largo.
            'subject.max' => 'El asunto no puede superar los 150 caracteres.',
            // Esta línea sirve para definir el mensaje si falta el mensaje.
            'message.required' => 'Escribe tu mensaje.',
            // Esta línea sirve para definir el mensaje si el mensaje es muy corto.
            'message.min' => 'El mensaje es demasiado corto.',
            // Esta línea sirve para definir el mensaje si el mensaje es muy largo.
            'message.max' => 'El mensaje no puede superar los 5000 caracteres.',
        ];
    }
}
