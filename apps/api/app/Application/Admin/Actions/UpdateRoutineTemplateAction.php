<?php

namespace App\Application\Admin\Actions;

use App\Application\Admin\Actions\Concerns\SyncsRoutineTemplateDays;
use App\Models\RoutineTemplate;
use Illuminate\Support\Facades\DB;

/**
 * Reemplazo completo de días/ejercicios (delete + recrea), igual que
 * UpdateManualRoutineAction — no toca `is_active` (eso solo lo cambian
 * activate()/deactivate() en el controller, para no romper la garantía de
 * "una sola plantilla activa por sexo+frecuencia").
 *
 * Esto edita SOLO la plantilla — nunca las Routine/RoutineDay/RoutineExercise
 * ya generadas para usuarios reales (tablas completamente separadas, sin FK
 * entre sí), así que el historial de nadie se ve afectado.
 */
class UpdateRoutineTemplateAction
{
    use SyncsRoutineTemplateDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(RoutineTemplate $template, array $data): RoutineTemplate
    {
        return DB::transaction(function () use ($template, $data) {
            $template->update(array_intersect_key($data, array_flip(['name', 'sex', 'frequency_days', 'split_type'])));

            if (array_key_exists('days', $data)) {
                $template->days()->delete();
                $this->syncRoutineTemplateDays($template, $data['days']);
            }

            return $template->load('days.exercises.exercise.primaryMuscle');
        });
    }
}
