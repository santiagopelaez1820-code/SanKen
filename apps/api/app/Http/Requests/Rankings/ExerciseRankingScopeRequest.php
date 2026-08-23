<?php

namespace App\Http\Requests\Rankings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExerciseRankingScopeRequest extends FormRequest
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
            'scope' => ['required', Rule::in(['global', 'country', 'city'])],
            'sex' => ['required', Rule::in(['male', 'female'])],
        ];
    }
}
