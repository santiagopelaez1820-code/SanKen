<?php

namespace App\Http\Requests\Stats;

use Illuminate\Foundation\Http\FormRequest;

class ProgressQueryRequest extends FormRequest
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
            'metric' => ['required', 'string', 'in:weight,volume,1rm'],
            'exercise_id' => ['required_if:metric,1rm', 'integer', 'exists:exercises,id'],
        ];
    }
}
