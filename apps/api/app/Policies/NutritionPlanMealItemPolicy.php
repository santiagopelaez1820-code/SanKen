<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo NutritionPlanMealItem (alimento del plan).
use App\Models\NutritionPlanMealItem;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de los alimentos del plan.
class NutritionPlanMealItemPolicy
{
    // Esta línea sirve para declarar el permiso para modificar un alimento del plan.
    public function update(User $user, NutritionPlanMealItem $mealItem): bool
    {
        // Esta línea sirve para permitirlo solo si el plan es del usuario.
        return $user->id === $mealItem->meal->plan->user_id;
    }
}
