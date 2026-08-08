<?php

namespace App\Http\Requests\Trainer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreManualRoutineRequest extends FormRequest
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
        return [
            'goal' => ['required', 'string', Rule::in(array_keys(config('routine_engine.goal_parameters')))],
            'split_type' => ['required', 'string', Rule::in(['full_body', 'upper_lower', 'push_pull_legs', 'bro_split'])],
            'frequency_days' => ['required', 'integer', 'min:1', 'max:7'],
            'duration_weeks' => ['required', 'integer', 'min:1', 'max:24'],

            'days' => ['required', 'array', 'min:1'],
            'days.*.day_order' => ['required', 'integer', 'min:1'],
            'days.*.label' => ['required', 'string', 'max:100'],
            'days.*.target_muscle_groups' => ['nullable', 'array'],
            'days.*.target_muscle_groups.*' => ['string'],

            'days.*.exercises' => ['required', 'array', 'min:1'],
            'days.*.exercises.*.exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'days.*.exercises.*.order' => ['required', 'integer', 'min:1'],
            'days.*.exercises.*.target_sets' => ['required', 'integer', 'min:1', 'max:10'],
            'days.*.exercises.*.target_reps' => ['required', 'string', 'max:20'],
            'days.*.exercises.*.rest_seconds' => ['required', 'integer', 'min:0', 'max:600'],
            'days.*.exercises.*.target_rpe' => ['nullable', 'numeric', 'between:0,10'],
        ];
    }
}
