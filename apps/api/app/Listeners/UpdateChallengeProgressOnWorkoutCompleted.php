<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los listeners.

namespace App\Listeners;

// Esta línea sirve para importar la acción que recalcula el progreso de los retos.
use App\Application\Challenges\Actions\RecalculateChallengeProgressAction;
// Esta línea sirve para importar el evento de entrenamiento completado.
use App\Events\WorkoutCompleted;

/**
 * Fire-and-forget, igual que AwardXpForPrBroken/EvaluateStreakAchievement:
 * no se lee su retorno (ver el fix en CompleteWorkoutSessionAction sobre
 * por qué la respuesta HTTP solo depende del primer listener registrado).
 */
// Esta línea sirve para declarar el listener que actualiza los retos al completar un entrenamiento.
class UpdateChallengeProgressOnWorkoutCompleted
{
    // Esta línea sirve para declarar el método que atiende el evento.
    public function handle(WorkoutCompleted $event): void
    {
        // Esta línea sirve para recalcular el progreso de los retos en el momento.
        RecalculateChallengeProgressAction::dispatchSync($event->user);
    }
}
