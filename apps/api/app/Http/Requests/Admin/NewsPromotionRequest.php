<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class NewsPromotionRequest extends FormRequest
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
            'title' => [$sometimesOnUpdate, 'string', 'max:200'],
            'body' => [$sometimesOnUpdate, 'string'],
            'image_url' => ['nullable', 'string', 'max:500'],
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
