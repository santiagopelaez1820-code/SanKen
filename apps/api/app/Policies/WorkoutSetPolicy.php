<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSet (serie).
use App\Models\WorkoutSet;

// Esta línea sirve para declarar la policy de las series.
class WorkoutSetPolicy
{
    // Esta línea sirve para declarar el permiso para modificar una serie.
    public function update(User $user, WorkoutSet $workoutSet): bool
    {
        // Esta línea sirve para cargar el ejercicio y la sesión de la serie si no estaban cargados.
        $workoutSet->loadMissing('workoutExercise.workoutSession');

        // Esta línea sirve para permitirlo solo si la sesión de la serie es del usuario.
        return $user->id === $workoutSet->workoutExercise->workoutSession->user_id;
    }
}
