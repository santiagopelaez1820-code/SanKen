<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del entrenador.

namespace App\Http\Requests\Trainer;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación del cambio de estado de un cliente.
class UpdateClientStatusRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso sobre la relación lo verifica el controller).
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
            // Esta línea sirve para exigir el estado: activo, pausado o terminado.
            'status' => ['required', 'string', Rule::in(['active', 'paused', 'ended'])],
        ];
    }
}
