<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de entrenamientos.

namespace App\Http\Requests\Workout;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la corrección de una serie.
class UpdateSetRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso sobre la serie lo verifica el controller).
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
            // Esta línea sirve para permitir opcionalmente el peso entre 0 y 600 kg.
            'weight_kg' => ['sometimes', 'numeric', 'min:0', 'max:600'],
            // Esta línea sirve para permitir opcionalmente las repeticiones entre 1 y 200.
            'reps' => ['sometimes', 'integer', 'min:1', 'max:200'],
            // Esta línea sirve para permitir opcionalmente el RPE entre 0 y 10 (o null).
            'rpe' => ['sometimes', 'nullable', 'numeric', 'between:0,10'],
            // Esta línea sirve para permitir opcionalmente marcarla como serie de calentamiento.
            'is_warmup' => ['sometimes', 'boolean'],
            // Esta línea sirve para permitir opcionalmente marcarla como completada.
            'completed' => ['sometimes', 'boolean'],
        ];
    }
}
