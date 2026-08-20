<?php

namespace App\Http\Requests\Admin;

use App\Domain\Challenges\Services\ChallengeCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que
 * RoutineTemplateRequest). `metric` está limitado a las que
 * ChallengeProgressCalculator ya sabe calcular — agregar una nueva
 * requiere código, no es un campo libre. No valida `is_active` a
 * propósito: eso lo cambian los endpoints dedicados activate()/deactivate().
 */
class ChallengeTemplateRequest extends FormRequest
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
            'code' => [
                $sometimesOnUpdate, 'string', 'max:100', 'alpha_dash',
                Rule::unique('challenge_templates', 'code')->ignore($this->route('challengeTemplate')),
            ],
            'title' => [$sometimesOnUpdate, 'string', 'max:150'],
            'description' => [$sometimesOnUpdate, 'string', 'max:500'],
            'type' => [$sometimesOnUpdate, 'string', Rule::in([ChallengeCatalog::TYPE_WEEKLY, ChallengeCatalog::TYPE_MONTHLY])],
            'metric' => [
                $sometimesOnUpdate, 'string',
                Rule::in([ChallengeCatalog::METRIC_WORKOUTS_COUNT, ChallengeCatalog::METRIC_TOTAL_VOLUME_KG]),
            ],
            'target' => [$sometimesOnUpdate, 'numeric', 'min:0.01'],
        ];
    }
}
