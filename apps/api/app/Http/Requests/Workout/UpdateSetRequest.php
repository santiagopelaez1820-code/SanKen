<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSetRequest extends FormRequest
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
            'weight_kg' => ['sometimes', 'numeric', 'min:0', 'max:600'],
            'reps' => ['sometimes', 'integer', 'min:1', 'max:200'],
            'rpe' => ['sometimes', 'nullable', 'numeric', 'between:0,10'],
            'is_warmup' => ['sometimes', 'boolean'],
            'completed' => ['sometimes', 'boolean'],
        ];
    }
}
