<?php

namespace App\Application\Workout\Actions;

use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;

class AddExerciseToSessionAction
{
    public function execute(WorkoutSession $session, int $exerciseId): WorkoutExercise
    {
        $nextOrder = $session->exercises()->max('order') + 1;

        return $session->exercises()->create([
            'exercise_id' => $exerciseId,
            'order' => $nextOrder,
            'all_sets_completed' => false,
            'target_sets' => 3,
        ])->load('exercise');
    }
}
