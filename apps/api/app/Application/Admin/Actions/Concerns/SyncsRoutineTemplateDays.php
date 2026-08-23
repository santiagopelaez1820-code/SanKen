<?php

namespace App\Application\Admin\Actions\Concerns;

use App\Models\RoutineTemplate;

/**
 * Análogo a SyncsRoutineDays (App\Application\Routine\Actions\Concerns) pero
 * para las tablas de plantilla (routine_template_days/_exercises) — mismos
 * pasos, nombres de columna distintos (default_sets/default_reps/default_rpe
 * en vez de target_sets/target_reps/target_rpe).
 */
trait SyncsRoutineTemplateDays
{
    /**
     * @param  array<int, array<string, mixed>>  $days
     */
    private function syncRoutineTemplateDays(RoutineTemplate $template, array $days): void
    {
        foreach ($days as $day) {
            $templateDay = $template->days()->create([
                'day_order' => $day['day_order'],
                'label' => $day['label'],
            ]);

            foreach ($day['exercises'] as $exercise) {
                $templateDay->exercises()->create([
                    'exercise_id' => $exercise['exercise_id'],
                    'order' => $exercise['order'],
                    'default_sets' => $exercise['default_sets'],
                    'default_reps' => $exercise['default_reps'],
                    'rest_seconds' => $exercise['rest_seconds'],
                    'default_rpe' => $exercise['default_rpe'] ?? null,
                ]);
            }
        }
    }
}
