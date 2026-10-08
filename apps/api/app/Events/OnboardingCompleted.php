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
 * Disparado cuando un usuario termina el onboarding. A partir del Sprint 2,
 * un listener en cola escucha este evento y dispara GenerateRoutineAction.
 */
// Esta línea sirve para declarar el evento que avisa que un usuario terminó el onboarding.
class OnboardingCompleted
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe al usuario.
    public function __construct(
        // Esta línea sirve para guardar el usuario.
        public readonly User $user,
    ) {}
}
