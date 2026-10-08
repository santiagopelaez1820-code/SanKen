<?php

// Esta línea sirve para ubicar esta interfaz en el espacio de nombres de los contratos de rutina.

namespace App\Domain\Routine\Contracts;

// Esta línea sirve para importar el objeto que representa una rutina generada.
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar el contrato del repositorio de rutinas.
interface RoutineRepositoryInterface
{
    // Esta línea sirve para exigir el método que busca la rutina activa de un usuario.
    public function findActiveForUser(User $user): ?Routine;

    /**
     * Desactiva cualquier rutina activa del usuario y persiste la nueva
     * como generada por el motor (source=engine).
     */
    // Esta línea sirve para exigir el método que guarda una rutina generada por el motor.
    public function saveGenerated(User $user, GeneratedRoutine $routine): Routine;
}
