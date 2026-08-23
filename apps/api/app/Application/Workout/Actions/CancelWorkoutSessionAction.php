<?php

namespace App\Application\Workout\Actions;

use App\Models\WorkoutSession;
use Illuminate\Validation\ValidationException;

/**
 * "Salir del entrenamiento" desde una sesión en curso. Deliberadamente NO
 * marca completed=true (una sesión cancelada nunca debe contar como
 * entrenada en el calendario, que ya filtra por completed) y nunca
 * dispara SubmitSessionFeedbackAction — así una salida a mitad de camino
 * jamás afecta la sobrecarga progresiva. Las series ya registradas
 * (WorkoutSet) no se tocan: quedan en la sesión cancelada como historial,
 * simplemente esa sesión deja de ser "la sesión activa".
 */
class CancelWorkoutSessionAction
{
    public function execute(WorkoutSession $session): WorkoutSession
    {
        if ($session->completed) {
            throw ValidationException::withMessages([
                'session' => ['Este entrenamiento ya fue completado, no se puede cancelar.'],
            ]);
        }

        if ($session->cancelled_at) {
            return $session;
        }

        $session->update(['cancelled_at' => now()]);

        return $session->fresh(['exercises.exercise', 'exercises.sets']);
    }
}
