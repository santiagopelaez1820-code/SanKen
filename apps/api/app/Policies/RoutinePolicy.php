<?php

namespace App\Policies;

use App\Models\Routine;
use App\Models\User;

class RoutinePolicy
{
    /**
     * El dueño de la rutina puede verla (uso del propio atleta).
     */
    public function view(User $user, Routine $routine): bool
    {
        return $user->is($routine->user);
    }

    /**
     * El entrenador que creó una rutina manual puede verla/editarla.
     */
    public function manage(User $user, Routine $routine): bool
    {
        return $routine->source === 'trainer' && $user->is($routine->createdByTrainer);
    }
}
