<?php

namespace App\Policies;

use App\Models\NutritionPlanMealItem;
use App\Models\User;

class NutritionPlanMealItemPolicy
{
    public function update(User $user, NutritionPlanMealItem $mealItem): bool
    {
        return $user->id === $mealItem->meal->plan->user_id;
    }
}
