<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar el catálogo de tipos y métricas de retos.
use App\Domain\Challenges\Services\ChallengeCatalog;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que
 * RoutineTemplateRequest). `metric` está limitado a las que
 * ChallengeProgressCalculator ya sabe calcular — agregar una nueva
 * requiere código, no es un campo libre. No valida `is_active` a
 * propósito: eso lo cambian los endpoints dedicados activate()/deactivate().
 *
 * @ignoreSchema Sin schema compartido: Scramble documenta POST y PATCH con sus propias reglas.
 */
// Esta línea sirve para declarar la validación para crear o editar una plantilla de reto.
class ChallengeTemplateRequest extends FormRequest
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
            // Esta línea sirve para validar el código del reto.
            'code' => [
                // Esta línea sirve para exigir texto de hasta 100 caracteres con solo letras, números, guiones y guiones bajos.
                $sometimesOnUpdate, 'string', 'max:100', 'alpha_dash',
                // Esta línea sirve para exigir que el código no lo use otra plantilla (sin contar la que se edita).
                Rule::unique('challenge_templates', 'code')->ignore($this->route('challengeTemplate')),
            ],
            // Esta línea sirve para validar el título (hasta 150 caracteres).
            'title' => [$sometimesOnUpdate, 'string', 'max:150'],
            // Esta línea sirve para validar la descripción (hasta 500 caracteres).
            'description' => [$sometimesOnUpdate, 'string', 'max:500'],
            // Esta línea sirve para validar que el tipo sea semanal o mensual.
            'type' => [$sometimesOnUpdate, 'string', Rule::in([ChallengeCatalog::TYPE_WEEKLY, ChallengeCatalog::TYPE_MONTHLY])],
            // Esta línea sirve para validar la métrica.
            'metric' => [
                // Esta línea sirve para exigir que sea texto.
                $sometimesOnUpdate, 'string',
                // Esta línea sirve para exigir que sea una métrica que el sistema sabe calcular.
                Rule::in([ChallengeCatalog::METRIC_WORKOUTS_COUNT, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG]),
            ],
            // Esta línea sirve para validar que la meta sea un número mayor a 0.
            'target' => [$sometimesOnUpdate, 'numeric', 'min:0.01'],
        ];
    }
}
