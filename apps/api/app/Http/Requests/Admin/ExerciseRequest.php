<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar: en PATCH todos los campos son
 * opcionales.
 *
 * @ignoreSchema Sin schema compartido: Scramble documenta POST y PATCH con sus propias reglas.
 */
// Esta línea sirve para declarar la validación para crear o editar un ejercicio.
class ExerciseRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para hacer los campos opcionales al editar (PATCH) y obligatorios al crear.
        $sometimesOnUpdate = $this->isMethod('patch') ? 'sometimes' : 'required';

        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para validar el nombre (hasta 150 caracteres).
            'name' => [$sometimesOnUpdate, 'string', 'max:150'],
            // Esta línea sirve para validar que el músculo principal exista.
            'primary_muscle_id' => [$sometimesOnUpdate, 'integer', 'exists:muscle_groups,id'],
            // Esta línea sirve para validar que el equipamiento sea uno de los configurados.
            'equipment' => [$sometimesOnUpdate, 'string', Rule::in(config('onboarding.equipment'))],
            // Esta línea sirve para validar que el nivel sea uno de los configurados.
            'level' => [$sometimesOnUpdate, 'string', Rule::in(config('onboarding.levels'))],
            // Esta línea sirve para validar que el tipo sea compuesto, aislamiento, cardio o movilidad.
            'type' => [$sometimesOnUpdate, 'string', Rule::in(['compound', 'isolation', 'cardio', 'mobility'])],
            // Esta línea sirve para permitir opcionalmente las instrucciones.
            'instructions' => ['nullable', 'string'],
            // Esta línea sirve para permitir opcionalmente los errores comunes.
            'common_mistakes' => ['nullable', 'string'],
            // Esta línea sirve para permitir opcionalmente los consejos.
            'tips' => ['nullable', 'string'],
            // Esta línea sirve para permitir opcionalmente la URL del video (hasta 500 caracteres).
            'video_url' => ['nullable', 'string', 'max:500'],
            // Esta línea sirve para permitir opcionalmente la URL de la imagen (hasta 500 caracteres).
            'image_url' => ['nullable', 'string', 'max:500'],
            // Esta línea sirve para permitir opcionalmente activar o desactivar el ejercicio.
            'is_active' => ['sometimes', 'boolean'],
            // No es columna de exercises — el controller la extrae aparte
            // para sincronizar exercise_alternatives en ambas direcciones.
            // Esta línea sirve para validar el ejercicio alternativo.
            'alternative_exercise_id' => [
                // Esta línea sirve para permitir que falte o sea null, y si viene exigir que exista.
                'sometimes', 'nullable', 'integer', 'exists:exercises,id',
                // Esta línea sirve para impedir que el ejercicio sea su propia alternativa.
                Rule::notIn([$this->route('exercise')?->id]),
            ],
        ];
    }
}
