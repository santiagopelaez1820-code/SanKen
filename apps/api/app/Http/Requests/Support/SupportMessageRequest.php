<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de soporte.

namespace App\Http\Requests\Support;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

/** Un mensaje en la conversación de una solicitud (usuario o equipo). */
// Esta línea sirve para declarar la validación de un mensaje de soporte.
class SupportMessageRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso sobre la solicitud lo verifica el controller).
        return true;
    }

    // Esta línea sirve para declarar el método que prepara los datos antes de validar.
    protected function prepareForValidation(): void
    {
        // Esta línea sirve para quitar los espacios al inicio y al final del mensaje.
        $this->merge(['body' => is_string($this->body) ? trim($this->body) : $this->body]);
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir el mensaje (entre 1 y 5000 caracteres).
            'body' => ['required', 'string', 'min:1', 'max:5000'],
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
            // Esta línea sirve para definir el mensaje si falta el texto.
            'body.required' => 'Escribe un mensaje.',
            // Esta línea sirve para definir el mensaje si el texto es muy largo.
            'body.max' => 'El mensaje no puede superar los 5000 caracteres.',
        ];
    }
}
