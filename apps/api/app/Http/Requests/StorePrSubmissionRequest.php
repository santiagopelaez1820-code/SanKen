<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones.

namespace App\Http\Requests;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la postulación de un PR.
class StorePrSubmissionRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
        return true;
    }

    /**
     * Mismos límites que RegisterPersonalRecordRequest (registro manual
     * privado) — el número en sí es igual de plausible acá, lo único que
     * cambia es que esta postulación necesita revisión antes de contar
     * para Rankings.
     *
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir que el ejercicio exista.
            'exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            // Esta línea sirve para exigir el peso entre 0,1 y 1000 kg.
            'weight_kg' => ['required', 'numeric', 'min:0.1', 'max:1000'],
            // Esta línea sirve para exigir las repeticiones entre 1 y 50.
            'reps' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
