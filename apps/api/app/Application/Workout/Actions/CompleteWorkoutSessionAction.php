<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar la acción que recalcula las estadísticas del día.
use App\Application\Stats\Actions\AggregateDailyStatsAction;
// Esta línea sirve para importar el evento que avisa que se completó un entrenamiento.
use App\Events\WorkoutCompleted;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Cierra la sesión de entrenamiento, dispara el recálculo de estadísticas
 * diarias (Sprint 5) y otorga XP/logros (Sprint 8).
 */
// Esta línea sirve para declarar la acción que termina una sesión de entrenamiento.
class CompleteWorkoutSessionAction
{
    /**
     * @return array{session: WorkoutSession, gamification: array}
     */
    // Esta línea sirve para declarar el método que recibe la sesión, la duración y las notas.
    public function execute(WorkoutSession $session, ?int $durationMinutes, ?string $notes): array
    {
        // Guarda defensiva contra un replay/carrera del cliente: una vez
        // cancelada (ver CancelWorkoutSessionAction), una sesión nunca debe
        // poder terminar completándose de todas formas.
        // Esta línea sirve para revisar si la sesión fue cancelada.
        if ($session->cancelled_at) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que no se puede completar una sesión cancelada.
                'session' => ['Este entrenamiento fue cancelado, no se puede completar.'],
            ]);
        }

        // Todo lo que sigue (marcar completada + recalcular stats + XP/logros/
        // retos) va en una sola transacción: si cualquier listener de
        // WorkoutCompleted falla a mitad de camino, la sesión NO debe quedar
        // completed=true con el resto del estado (XP, streak, progreso de
        // retos) a medio aplicar -- eso dejaría al cliente viendo un error
        // pero al entrenamiento ya marcado como terminado, sin forma de
        // reintentar limpio.
        // Esta línea sirve para hacer todo el cierre dentro de una transacción y devolver el resultado.
        return DB::transaction(function () use ($session, $durationMinutes, $notes) {
            // Esta línea sirve para actualizar la sesión.
            $session->update([
                // Esta línea sirve para marcarla como completada.
                'completed' => true,
                // Esta línea sirve para guardar la duración enviada, o conservar la que tenía.
                'duration_minutes' => $durationMinutes ?? $session->duration_minutes,
                // Esta línea sirve para guardar las notas enviadas, o conservar las que tenía.
                'notes' => $notes ?? $session->notes,
            ]);

            // Esta línea sirve para encolar el recálculo de las estadísticas de ese día.
            AggregateDailyStatsAction::dispatch($session->user, $session->performed_at->toDateString());

            // WorkoutCompleted no implementa ShouldQueue: corre en el mismo
            // request y el retorno de su primer listener (AwardXpForWorkoutCompleted,
            // registrado primero en AppServiceProvider::boot()) es el resultado
            // de gamificación que el cliente necesita para la animación de
            // subida de nivel sin hacer polling. Desde Sprint 10 hay un segundo
            // listener (UpdateChallengeProgressOnWorkoutCompleted) que no
            // devuelve nada — por eso se indexa [0] explícitamente en vez de
            // desestructurar por posición, que ya no representaría "el único
            // listener". El `?? null` además evita un warning-como-error bajo
            // Event::fake() (usado en tests), donde dispatch() devuelve null en
            // vez de un array de resultados.
            // Esta línea sirve para disparar el evento y tomar el resultado de gamificación del primer listener.
            $gamification = WorkoutCompleted::dispatch($session->user)[0] ?? null;

            // Esta línea sirve para devolver el resultado.
            return [
                // Esta línea sirve para incluir la sesión con sus ejercicios y series.
                'session' => $session->load('exercises.exercise', 'exercises.sets'),
                // Esta línea sirve para incluir el resultado de XP y logros.
                'gamification' => $gamification,
            ];
        });
    }
}
