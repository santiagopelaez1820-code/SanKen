<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que ExerciseRequest)
 * — `days` es opcional en PATCH: si no viene, UpdateRoutineTemplateAction no
 * toca los días existentes; si viene, reemplaza todos.
 *
 * No valida `is_active` a propósito: esa columna solo la cambian los
 * endpoints dedicados activate()/deactivate(), nunca este formulario
 * genérico — así la garantía de "una sola plantilla activa por
 * sexo+frecuencia+nivel" vive en un solo lugar.
 *
 * @ignoreSchema Sin schema compartido: Scramble documenta POST y PATCH con sus propias reglas.
 */
// Esta línea sirve para declarar la validación para crear o editar una plantilla de rutina.
class RoutineTemplateRequest extends FormRequest
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
        // Esta línea sirve para hacer los campos opcionales al editar (PATCH) y obligatorios al crear.
        $sometimesOnUpdate = $this->isMethod('patch') ? 'sometimes' : 'required';

        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para permitir opcionalmente el nombre (hasta 150 caracteres).
            'name' => ['nullable', 'string', 'max:150'],
            // Esta línea sirve para validar que el sexo sea "male" o "female".
            'sex' => [$sometimesOnUpdate, 'string', Rule::in(['male', 'female'])],
            // Esta línea sirve para validar la frecuencia semanal entre 1 y 7 días.
            'frequency_days' => [$sometimesOnUpdate, 'integer', 'min:1', 'max:7'],
            // Mismo config que usa OnboardingRequest para el nivel del
            // usuario — un solo lugar para agregar/renombrar niveles en vez
            // de mantener el array sincronizado en dos Requests distintos.
            // Esta línea sirve para validar que el nivel sea uno de los configurados.
            'level' => [$sometimesOnUpdate, 'string', Rule::in(config('onboarding.levels'))],
            // Esta línea sirve para validar el tipo de división.
            'split_type' => [
                // Esta línea sirve para exigir que sea texto.
                $sometimesOnUpdate, 'string',
                // Esta línea sirve para exigir que sea una de las divisiones permitidas.
                Rule::in(['full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'ppl_upper_lower']),
            ],

            // Esta línea sirve para exigir los días al crear (opcionales al editar), con al menos uno.
            'days' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'array', 'min:1'],
            // Esta línea sirve para exigir el orden de cada día si se envían días.
            'days.*.day_order' => ['required_with:days', 'integer', 'min:1'],
            // Esta línea sirve para exigir el nombre de cada día si se envían días.
            'days.*.label' => ['required_with:days', 'string', 'max:100'],

            // Esta línea sirve para exigir al menos un ejercicio por día.
            'days.*.exercises' => ['required_with:days', 'array', 'min:1'],
            // Esta línea sirve para exigir que cada ejercicio exista.
            'days.*.exercises.*.exercise_id' => ['required_with:days', 'integer', 'exists:exercises,id'],
            // Esta línea sirve para exigir el orden de cada ejercicio.
            'days.*.exercises.*.order' => ['required_with:days', 'integer', 'min:1'],
            // Esta línea sirve para exigir las series por defecto entre 1 y 10.
            'days.*.exercises.*.default_sets' => ['required_with:days', 'integer', 'min:1', 'max:10'],
            // Esta línea sirve para exigir las repeticiones por defecto como texto (por ejemplo "8-12").
            'days.*.exercises.*.default_reps' => ['required_with:days', 'string', 'max:20'],
            // Esta línea sirve para exigir el descanso entre 0 y 600 segundos.
            'days.*.exercises.*.rest_seconds' => ['required_with:days', 'integer', 'min:0', 'max:600'],
            // Esta línea sirve para permitir opcionalmente el RPE por defecto entre 0 y 10.
            'days.*.exercises.*.default_rpe' => ['nullable', 'numeric', 'between:0,10'],
        ];
    }
}
