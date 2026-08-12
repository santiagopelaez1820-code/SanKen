<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExerciseRequest extends FormRequest
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
            'name' => [$sometimesOnUpdate, 'string', 'max:150'],
            'primary_muscle_id' => [$sometimesOnUpdate, 'integer', 'exists:muscle_groups,id'],
            'equipment' => [$sometimesOnUpdate, 'string', Rule::in(config('onboarding.equipment'))],
            'level' => [$sometimesOnUpdate, 'string', Rule::in(config('onboarding.levels'))],
            'type' => [$sometimesOnUpdate, 'string', Rule::in(['compound', 'isolation', 'cardio', 'mobility'])],
            'instructions' => ['nullable', 'string'],
            'common_mistakes' => ['nullable', 'string'],
            'tips' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
