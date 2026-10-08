<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del onboarding.

namespace App\Http\Requests\Onboarding;

// Esta línea sirve para importar el modelo RoutineTemplate para saber qué frecuencias tienen plantilla.
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Cubre tanto POST (envío inicial) como PATCH (edición) del onboarding.
 * Todos los campos son opcionales aquí a propósito: el wizard móvil puede
 * enviar respuestas parciales a medida que el usuario avanza. La completitud
 * se exige recién en OnboardingController::complete().
 */
// Esta línea sirve para declarar la validación de las respuestas del onboarding.
class OnboardingRequest extends FormRequest
{
    /**
     * Rango de edad admitido (inclusive). Debe coincidir con
     * ONBOARDING_MIN_AGE / ONBOARDING_MAX_AGE en
     * packages/core/src/lib/onboarding-age.ts, que web y mobile usan para
     * no dejar avanzar el wizard — acá es la validación que manda.
     */
    // Esta línea sirve para definir la edad mínima permitida.
    public const MIN_AGE = 15;

    // Esta línea sirve para definir la edad máxima permitida.
    public const MAX_AGE = 70;

    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para validar la edad entre la mínima y la máxima.
            'age' => ['sometimes', 'integer', 'min:'.self::MIN_AGE, 'max:'.self::MAX_AGE],
            // Esta línea sirve para validar que el sexo sea "male" o "female".
            'sex' => ['sometimes', Rule::in(['male', 'female'])],
            // Esta línea sirve para validar la altura entre 100 y 250 cm.
            'height_cm' => ['sometimes', 'numeric', 'min:100', 'max:250'],
            // Esta línea sirve para validar el peso entre 30 y 300 kg.
            'weight_kg' => ['sometimes', 'numeric', 'min:30', 'max:300'],
            // Esta línea sirve para validar que el país exista (o null).
            'country_id' => ['sometimes', 'nullable', 'exists:countries,id'],
            // Esta línea sirve para validar que la ciudad exista (o null).
            'city_id' => ['sometimes', 'nullable', 'exists:cities,id'],
            // Esta línea sirve para validar que el gimnasio exista (o null).
            'gym_id' => ['sometimes', 'nullable', 'exists:gyms,id'],

            // Esta línea sirve para validar que el nivel sea uno de los configurados.
            'level' => ['sometimes', Rule::in(config('onboarding.levels'))],
            // Esta línea sirve para validar que haya al menos un objetivo.
            'goals' => ['sometimes', 'array', 'min:1'],
            // Esta línea sirve para validar que cada objetivo sea uno de los configurados.
            'goals.*' => [Rule::in(config('onboarding.goals'))],
            // Esta línea sirve para validar que la frecuencia tenga una plantilla de rutina activa.
            'frequency_days' => ['sometimes', Rule::in(RoutineTemplate::activeFrequencyDays())],
            // Esta línea sirve para validar que el equipamiento sea una lista.
            'equipment_available' => ['sometimes', 'array'],
            // Esta línea sirve para validar que cada equipamiento sea uno de los configurados.
            'equipment_available.*' => [Rule::in(config('onboarding.equipment'))],
        ];
    }

    /**
     * Mismo texto que muestran web y mobile (ONBOARDING_AGE_MESSAGES) — el
     * wizard muestra el mensaje de la API tal cual si llegara a rechazarse.
     *
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para armar el mensaje de edad fuera de rango.
        $outOfRange = 'La edad debe estar entre '.self::MIN_AGE.' y '.self::MAX_AGE.' años.';

        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si la edad no es un número entero.
            'age.integer' => 'La edad debe ser un número entero.',
            // Esta línea sirve para usar el mensaje de fuera de rango si es menor a la mínima.
            'age.min' => $outOfRange,
            // Esta línea sirve para usar el mensaje de fuera de rango si es mayor a la máxima.
            'age.max' => $outOfRange,
        ];
    }
}
