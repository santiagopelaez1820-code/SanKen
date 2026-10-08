<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo MealLog (comida registrada).
use App\Models\MealLog;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de las comidas registradas.
class MealLogPolicy
{
    // Esta línea sirve para declarar el permiso para borrar una comida.
    public function delete(User $user, MealLog $mealLog): bool
    {
        // Esta línea sirve para permitirlo solo si la comida es del usuario.
        return $user->id === $mealLog->user_id;
    }
}
