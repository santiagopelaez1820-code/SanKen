<?php

namespace App\Policies;

use App\Models\MealLog;
use App\Models\User;

class MealLogPolicy
{
    public function delete(User $user, MealLog $mealLog): bool
    {
        return $user->id === $mealLog->user_id;
    }
}
