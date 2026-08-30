<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que
 * NewsPromotionRequest). El slug nunca se acepta del cliente: se genera en
 * el controller a partir de `name`.
 */
class ProductRequest extends FormRequest
{
    public const CATEGORIES = ['protein', 'creatine', 'pre_workout', 'amino_acids', 'vitamins', 'other'];

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
            'description' => [$sometimesOnUpdate, 'string'],
            'short_description' => [$sometimesOnUpdate, 'string', 'max:200'],
            'category' => [$sometimesOnUpdate, 'string', Rule::in(self::CATEGORIES)],
            'price' => [$sometimesOnUpdate, 'numeric', 'min:0'],
            'active' => ['sometimes', 'boolean'],
            'dropi_reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
