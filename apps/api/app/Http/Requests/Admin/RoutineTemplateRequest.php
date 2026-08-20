<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que ExerciseRequest)
 * — `days` es opcional en PATCH: si no viene, UpdateRoutineTemplateAction no
 * toca los días existentes; si viene, reemplaza todos.
 *
 * No valida `is_active` a propósito: esa columna solo la cambian los
 * endpoints dedicados activate()/deactivate(), nunca este formulario
 * genérico — así la garantía de "una sola plantilla activa por
 * sexo+frecuencia" vive en un solo lugar.
 */
class RoutineTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $sometimesOnUpdate = $this->isMethod('patch') ? 'sometimes' : 'required';

        return [
            'name' => ['nullable', 'string', 'max:150'],
            'sex' => [$sometimesOnUpdate, 'string', Rule::in(['male', 'female'])],
            'frequency_days' => [$sometimesOnUpdate, 'integer', 'min:1', 'max:7'],
            'split_type' => [
                $sometimesOnUpdate, 'string',
                Rule::in(['full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'ppl_upper_lower']),
            ],

            'days' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'array', 'min:1'],
            'days.*.day_order' => ['required_with:days', 'integer', 'min:1'],
            'days.*.label' => ['required_with:days', 'string', 'max:100'],

            'days.*.exercises' => ['required_with:days', 'array', 'min:1'],
            'days.*.exercises.*.exercise_id' => ['required_with:days', 'integer', 'exists:exercises,id'],
            'days.*.exercises.*.order' => ['required_with:days', 'integer', 'min:1'],
            'days.*.exercises.*.default_sets' => ['required_with:days', 'integer', 'min:1', 'max:10'],
            'days.*.exercises.*.default_reps' => ['required_with:days', 'string', 'max:20'],
            'days.*.exercises.*.rest_seconds' => ['required_with:days', 'integer', 'min:0', 'max:600'],
            'days.*.exercises.*.default_rpe' => ['nullable', 'numeric', 'between:0,10'],
        ];
    }
}
