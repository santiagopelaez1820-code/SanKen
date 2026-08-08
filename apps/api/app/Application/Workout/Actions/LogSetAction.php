<?php

namespace App\Application\Workout\Actions;

use App\Models\WorkoutExercise;
use App\Models\WorkoutSet;

class LogSetAction
{
    /**
     * @param  array{weight_kg: float, reps: int, rpe?: float|null, is_warmup?: bool, completed?: bool}  $data
     */
    public function execute(WorkoutExercise $workoutExercise, array $data): WorkoutSet
    {
        $setNumber = $workoutExercise->sets()->count() + 1;

        return $workoutExercise->sets()->create([
            'set_number' => $setNumber,
            'weight_kg' => $data['weight_kg'],
            'reps' => $data['reps'],
            'rpe' => $data['rpe'] ?? null,
            'is_warmup' => $data['is_warmup'] ?? false,
            'completed' => $data['completed'] ?? true,
        ]);
    }
}
