<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkoutSet;

class WorkoutSetPolicy
{
    public function update(User $user, WorkoutSet $workoutSet): bool
    {
        $workoutSet->loadMissing('workoutExercise.workoutSession');

        return $user->id === $workoutSet->workoutExercise->workoutSession->user_id;
    }
}
