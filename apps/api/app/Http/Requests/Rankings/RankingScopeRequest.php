<?php

namespace App\Http\Requests\Rankings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RankingScopeRequest extends FormRequest
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
            'scope' => ['required', Rule::in([
                'global', 'city', 'country', 'gym', 'age_bracket', 'sex', 'strength_category',
            ])],
        ];
    }
}
