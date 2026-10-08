<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del chat.

namespace App\Http\Requests\Chat;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación del envío de un mensaje de chat.
class SendMessageRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
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
            // Esta línea sirve para exigir el texto del mensaje (hasta 4000 caracteres).
            'body' => ['required', 'string', 'max:4000'],
        ];
    }
}
