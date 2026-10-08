<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
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
// Esta línea sirve para declarar la acción que cancela una sesión en curso.
class CancelWorkoutSessionAction
{
    // Esta línea sirve para declarar el método que recibe la sesión a cancelar.
    public function execute(WorkoutSession $session): WorkoutSession
    {
        // Esta línea sirve para revisar si la sesión ya estaba completada.
        if ($session->completed) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que no se puede cancelar una sesión completada.
                'session' => ['Este entrenamiento ya fue completado, no se puede cancelar.'],
            ]);
        }

        // Esta línea sirve para revisar si ya estaba cancelada.
        if ($session->cancelled_at) {
            // Esta línea sirve para devolverla sin cambios.
            return $session;
        }

        // Esta línea sirve para guardar la fecha de cancelación.
        $session->update(['cancelled_at' => now()]);

        // Esta línea sirve para devolver la sesión recargada con sus ejercicios y series.
        return $session->fresh(['exercises.exercise', 'exercises.sets']);
    }
}
