<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/** Usado tanto para asignar (POST) como para editar (PATCH) una rutina personalizada — el editor siempre envía el plan completo, igual que StoreManualRoutineRequest del entrenador. */
// Esta línea sirve para declarar la validación para asignar o editar una rutina personalizada.
class AssignRoutineRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
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
            // Esta línea sirve para exigir un objetivo que exista en la configuración del motor de rutinas.
            'goal' => ['required', 'string', Rule::in(array_keys(config('routine_engine.goal_parameters')))],
            // Esta línea sirve para exigir un tipo de división válido.
            'split_type' => ['required', 'string', Rule::in(['full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'ppl_upper_lower'])],
            // Esta línea sirve para exigir la frecuencia semanal entre 1 y 7 días.
            'frequency_days' => ['required', 'integer', 'min:1', 'max:7'],
            // Esta línea sirve para exigir la duración entre 1 y 24 semanas.
            'duration_weeks' => ['required', 'integer', 'min:1', 'max:24'],

            // Esta línea sirve para exigir al menos un día.
            'days' => ['required', 'array', 'min:1'],
            // Esta línea sirve para exigir el orden de cada día.
            'days.*.day_order' => ['required', 'integer', 'min:1'],
            // Esta línea sirve para exigir el nombre de cada día (hasta 100 caracteres).
            'days.*.label' => ['required', 'string', 'max:100'],
            // Esta línea sirve para permitir opcionalmente los grupos musculares de cada día.
            'days.*.target_muscle_groups' => ['nullable', 'array'],
            // Esta línea sirve para exigir que cada grupo muscular sea texto.
            'days.*.target_muscle_groups.*' => ['string'],

            // Esta línea sirve para exigir al menos un ejercicio por día.
            'days.*.exercises' => ['required', 'array', 'min:1'],
            // Esta línea sirve para exigir que cada ejercicio exista.
            'days.*.exercises.*.exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            // Esta línea sirve para exigir el orden de cada ejercicio.
            'days.*.exercises.*.order' => ['required', 'integer', 'min:1'],
            // Esta línea sirve para exigir las series objetivo entre 1 y 10.
            'days.*.exercises.*.target_sets' => ['required', 'integer', 'min:1', 'max:10'],
            // Esta línea sirve para exigir las repeticiones objetivo como texto (por ejemplo "8-12").
            'days.*.exercises.*.target_reps' => ['required', 'string', 'max:20'],
            // Esta línea sirve para exigir el descanso entre 0 y 600 segundos.
            'days.*.exercises.*.rest_seconds' => ['required', 'integer', 'min:0', 'max:600'],
            // Esta línea sirve para permitir opcionalmente el RPE objetivo entre 0 y 10.
            'days.*.exercises.*.target_rpe' => ['nullable', 'numeric', 'between:0,10'],
        ];
    }
}
