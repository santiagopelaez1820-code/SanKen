<?php

namespace App\Application\Admin\Actions;

use App\Application\Admin\Actions\Concerns\SyncsRoutineTemplateDays;
use App\Models\RoutineTemplate;
use Illuminate\Support\Facades\DB;

/**
 * Nace SIEMPRE inactiva (is_active=false), sin importar lo que traiga el
 * payload — igual que DuplicateRoutineTemplateAction. Activarla es un paso
 * aparte y deliberado (AdminRoutineTemplateController::activate), que es el
 * único lugar que garantiza "una sola plantilla activa por sexo+frecuencia"
 * dentro de una transacción. Crear ya-activa permitiría dos plantillas
 * activas para el mismo par sexo+frecuencia sin que nada lo evite.
 */
class CreateRoutineTemplateAction
{
    use SyncsRoutineTemplateDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): RoutineTemplate
    {
        return DB::transaction(function () use ($data) {
            $template = RoutineTemplate::query()->create([
                'name' => $data['name'] ?? null,
                'sex' => $data['sex'],
                'frequency_days' => $data['frequency_days'],
                'split_type' => $data['split_type'],
                'is_active' => false,
            ]);

            $this->syncRoutineTemplateDays($template, $data['days'] ?? []);

            return $template->load('days.exercises.exercise.primaryMuscle');
        });
    }
}
