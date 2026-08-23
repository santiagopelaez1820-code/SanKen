<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkoutSessionRequest extends FormRequest
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
            'duration_minutes' => ['sometimes', 'integer', 'min:1', 'max:600'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
        ];
    }
}
