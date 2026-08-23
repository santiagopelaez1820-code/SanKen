<?php

namespace App\Http\Requests\Onboarding;

use App\Models\RoutineTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Cubre tanto POST (envío inicial) como PATCH (edición) del onboarding.
 * Todos los campos son opcionales aquí a propósito: el wizard móvil puede
 * enviar respuestas parciales a medida que el usuario avanza. La completitud
 * se exige recién en OnboardingController::complete().
 */
class OnboardingRequest extends FormRequest
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
            'age' => ['sometimes', 'integer', 'min:13', 'max:100'],
            'sex' => ['sometimes', Rule::in(['male', 'female'])],
            'height_cm' => ['sometimes', 'numeric', 'min:100', 'max:250'],
            'weight_kg' => ['sometimes', 'numeric', 'min:30', 'max:300'],
            'country_id' => ['sometimes', 'nullable', 'exists:countries,id'],
            'city_id' => ['sometimes', 'nullable', 'exists:cities,id'],
            'gym_id' => ['sometimes', 'nullable', 'exists:gyms,id'],

            'level' => ['sometimes', Rule::in(config('onboarding.levels'))],
            'goals' => ['sometimes', 'array', 'min:1'],
            'goals.*' => [Rule::in(config('onboarding.goals'))],
            'frequency_days' => ['sometimes', Rule::in(RoutineTemplate::activeFrequencyDays())],
            'equipment_available' => ['sometimes', 'array'],
            'equipment_available.*' => [Rule::in(config('onboarding.equipment'))],
        ];
    }
}
