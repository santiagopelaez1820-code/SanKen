<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de entrenamientos.

namespace App\Http\Requests\Workout;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación para iniciar una sesión.
class StartWorkoutSessionRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el dueño de la rutina lo verifica el controller).
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
            // Esta línea sirve para permitir opcionalmente un día de rutina que exista.
            'routine_day_id' => ['nullable', 'integer', 'exists:routine_days,id'],
            // Esta línea sirve para permitir opcionalmente la calidad del sueño de 1 a 5.
            'sleep_quality' => ['nullable', 'integer', 'between:1,5'],
            // Esta línea sirve para permitir opcionalmente el nivel de energía de 1 a 5.
            'energy_level' => ['nullable', 'integer', 'between:1,5'],
            // Esta línea sirve para permitir opcionalmente el dolor muscular de 1 a 5.
            'muscle_soreness' => ['nullable', 'integer', 'between:1,5'],
        ];
    }
}
