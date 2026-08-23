<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

class LogSetRequest extends FormRequest
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
            'weight_kg' => ['required', 'numeric', 'min:0', 'max:600'],
            'reps' => ['required', 'integer', 'min:1', 'max:200'],
            'rpe' => ['nullable', 'numeric', 'between:0,10'],
            'is_warmup' => ['sometimes', 'boolean'],
            'completed' => ['sometimes', 'boolean'],
        ];
    }
}
