<?php

namespace App\Http\Requests\Progress;

use Illuminate\Foundation\Http\FormRequest;

class StoreBodyMeasurementRequest extends FormRequest
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
            'measured_at' => ['nullable', 'date', 'before_or_equal:today'],
            'weight_kg' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'body_fat_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'chest_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'waist_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'hip_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'arm_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'thigh_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            'progress_photo_url' => ['nullable', 'string', 'url', 'max:2048'],
        ];
    }

    public function withValidator($validator): void
    {
        $metrics = ['weight_kg', 'body_fat_pct', 'chest_cm', 'waist_cm', 'hip_cm', 'arm_cm', 'thigh_cm'];

        $validator->after(function ($validator) use ($metrics) {
            if (collect($metrics)->every(fn (string $field) => $this->input($field) === null)) {
                $validator->errors()->add('weight_kg', 'At least one measurement field is required.');
            }
        });
    }
}
