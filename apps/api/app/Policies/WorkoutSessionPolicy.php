<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;

// Esta línea sirve para declarar la policy de las sesiones de entrenamiento.
class WorkoutSessionPolicy
{
    // Esta línea sirve para declarar el permiso para ver una sesión.
    public function view(User $user, WorkoutSession $workoutSession): bool
    {
        // Esta línea sirve para permitirlo solo si la sesión es del usuario.
        return $user->is($workoutSession->user);
    }
}
