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
    /**
     * Rango de edad admitido (inclusive). Debe coincidir con
     * ONBOARDING_MIN_AGE / ONBOARDING_MAX_AGE en
     * packages/core/src/lib/onboarding-age.ts, que web y mobile usan para
     * no dejar avanzar el wizard — acá es la validación que manda.
     */
    public const MIN_AGE = 15;

    public const MAX_AGE = 70;

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
            'age' => ['sometimes', 'integer', 'min:'.self::MIN_AGE, 'max:'.self::MAX_AGE],
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

    /**
     * Mismo texto que muestran web y mobile (ONBOARDING_AGE_MESSAGES) — el
     * wizard muestra el mensaje de la API tal cual si llegara a rechazarse.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $outOfRange = 'La edad debe estar entre '.self::MIN_AGE.' y '.self::MAX_AGE.' años.';

        return [
            'age.integer' => 'La edad debe ser un número entero.',
            'age.min' => $outOfRange,
            'age.max' => $outOfRange,
        ];
    }
}
