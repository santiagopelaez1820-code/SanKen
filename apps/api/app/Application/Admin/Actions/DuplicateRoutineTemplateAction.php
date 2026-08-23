<?php

namespace App\Application\Admin\Actions;

use App\Models\RoutineTemplate;
use Illuminate\Support\Facades\DB;

class DuplicateRoutineTemplateAction
{
    public function execute(RoutineTemplate $source): RoutineTemplate
    {
        $source->loadMissing('days.exercises');

        return DB::transaction(function () use ($source) {
            $copy = RoutineTemplate::query()->create([
                'name' => trim(($source->name ?: "{$source->frequency_days} días").' (copia)'),
                'sex' => $source->sex,
                'frequency_days' => $source->frequency_days,
                'split_type' => $source->split_type,
                'is_active' => false,
            ]);

            foreach ($source->days as $day) {
                $newDay = $copy->days()->create([
                    'day_order' => $day->day_order,
                    'label' => $day->label,
                ]);

                foreach ($day->exercises as $exercise) {
                    $newDay->exercises()->create([
                        'exercise_id' => $exercise->exercise_id,
                        'order' => $exercise->order,
                        'default_sets' => $exercise->default_sets,
                        'default_reps' => $exercise->default_reps,
                        'rest_seconds' => $exercise->rest_seconds,
                        'default_rpe' => $exercise->default_rpe,
                    ]);
                }
            }

            return $copy->load('days.exercises.exercise.primaryMuscle');
        });
    }
}
