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
 * Disparado cuando AggregateDailyStatsAction detecta que la racha del
 * usuario acaba de cruzar un umbral (7/30/100 días) que no había cruzado
 * antes (Sprint 8: gamificación). Fire-and-forget.
 */
// Esta línea sirve para declarar el evento que avisa que la racha cruzó un hito.
class StreakMilestone
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, SerializesModels;

    // Esta línea sirve para declarar el constructor con sus datos.
    public function __construct(
        // Esta línea sirve para guardar el usuario.
        public readonly User $user,
        // Esta línea sirve para guardar los días de racha alcanzados.
        public readonly int $streakDays,
    ) {}
}
