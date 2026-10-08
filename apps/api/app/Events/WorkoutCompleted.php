<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los eventos.

namespace App\Events;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el trait que permite despachar el evento.
use Illuminate\Foundation\Events\Dispatchable;
// Esta línea sirve para importar el trait que serializa modelos.
use Illuminate\Queue\SerializesModels;

/**
 * Disparado sincrónicamente al completar una sesión de entrenamiento
 * (Sprint 8: gamificación). Su único listener otorga XP/logros y devuelve
 * el resultado — ver CompleteWorkoutSessionAction.
 */
// Esta línea sirve para declarar el evento que avisa que se completó un entrenamiento.
class WorkoutCompleted
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe al usuario.
    public function __construct(
        // Esta línea sirve para guardar el usuario.
        public readonly User $user,
    ) {}
}
