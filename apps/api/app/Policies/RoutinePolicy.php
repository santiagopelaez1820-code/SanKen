<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de las rutinas.
class RoutinePolicy
{
    /**
     * El dueño de la rutina puede verla (uso del propio atleta).
     */
    // Esta línea sirve para declarar el permiso para ver una rutina.
    public function view(User $user, Routine $routine): bool
    {
        // Esta línea sirve para permitirlo solo si la rutina es del usuario.
        return $user->is($routine->user);
    }

    /**
     * El entrenador que creó una rutina manual puede verla/editarla.
     */
    // Esta línea sirve para declarar el permiso para gestionar una rutina manual.
    public function manage(User $user, Routine $routine): bool
    {
        // Esta línea sirve para permitirlo solo si la creó este entrenador.
        return $routine->source === 'trainer' && $user->is($routine->createdByTrainer);
    }
}
