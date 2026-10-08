<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de entrenamientos.

namespace App\Http\Requests\Workout;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación para terminar una sesión.
class CompleteWorkoutSessionRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el dueño de la sesión lo verifica el controller).
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
            // Esta línea sirve para permitir opcionalmente la duración entre 1 y 600 minutos.
            'duration_minutes' => ['nullable', 'integer', 'min:1', 'max:600'],
            // Esta línea sirve para permitir opcionalmente notas (hasta 2000 caracteres).
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
