<?php

namespace App\Http\Requests\Stats;

use Illuminate\Foundation\Http\FormRequest;

class RegisterPersonalRecordRequest extends FormRequest
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
            'exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'weight_kg' => ['required', 'numeric', 'min:0.1', 'max:1000'],
            'reps' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
