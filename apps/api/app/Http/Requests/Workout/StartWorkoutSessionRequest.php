<?php

namespace App\Http\Requests\Workout;

use Illuminate\Foundation\Http\FormRequest;

class StartWorkoutSessionRequest extends FormRequest
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
            'routine_day_id' => ['nullable', 'integer', 'exists:routine_days,id'],
            'sleep_quality' => ['nullable', 'integer', 'between:1,5'],
            'energy_level' => ['nullable', 'integer', 'between:1,5'],
            'muscle_soreness' => ['nullable', 'integer', 'between:1,5'],
        ];
    }
}
