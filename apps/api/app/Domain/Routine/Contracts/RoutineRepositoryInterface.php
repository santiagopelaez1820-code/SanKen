<?php

namespace App\Domain\Routine\Contracts;

use App\Domain\Routine\ValueObjects\GeneratedRoutine;
use App\Models\Routine;
use App\Models\User;

interface RoutineRepositoryInterface
{
    public function findActiveForUser(User $user): ?Routine;

    /**
     * Desactiva cualquier rutina activa del usuario y persiste la nueva
     * como generada por el motor (source=engine).
     */
    public function saveGenerated(User $user, GeneratedRoutine $routine): Routine;
}
