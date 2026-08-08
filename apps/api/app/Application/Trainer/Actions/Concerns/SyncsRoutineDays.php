<?php

namespace App\Application\Trainer\Actions\Concerns;

use App\Models\Routine;

trait SyncsRoutineDays
{
    /**
     * @param  array<int, array<string, mixed>>  $days
     */
    private function syncRoutineDays(Routine $routine, array $days): void
    {
        foreach ($days as $day) {
            $routineDay = $routine->days()->create([
                'day_order' => $day['day_order'],
                'label' => $day['label'],
                'target_muscle_groups' => $day['target_muscle_groups'] ?? [],
            ]);

            foreach ($day['exercises'] as $exercise) {
                $routineDay->exercises()->create([
                    'exercise_id' => $exercise['exercise_id'],
                    'order' => $exercise['order'],
                    'target_sets' => $exercise['target_sets'],
                    'target_reps' => $exercise['target_reps'],
                    'rest_seconds' => $exercise['rest_seconds'],
                    'target_rpe' => $exercise['target_rpe'] ?? null,
                ]);
            }
        }
    }
}
