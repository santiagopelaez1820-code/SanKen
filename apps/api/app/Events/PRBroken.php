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
 * Disparado cuando DetectPersonalRecordAction confirma un récord personal
 * nuevo (Sprint 8: gamificación). Fire-and-forget: no se espera su retorno.
 */
// Esta línea sirve para declarar el evento que avisa que el usuario rompió un récord personal.
class PRBroken
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe al usuario.
    public function __construct(
        // Esta línea sirve para guardar el usuario.
        public readonly User $user,
    ) {}
}
