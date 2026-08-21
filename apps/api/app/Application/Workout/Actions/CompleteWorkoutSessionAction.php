<?php

namespace App\Application\Workout\Actions;

use App\Application\Stats\Actions\AggregateDailyStatsAction;
use App\Events\WorkoutCompleted;
use App\Models\WorkoutSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Cierra la sesión de entrenamiento, dispara el recálculo de estadísticas
 * diarias (Sprint 5) y otorga XP/logros (Sprint 8).
 */
class CompleteWorkoutSessionAction
{
    /**
     * @return array{session: WorkoutSession, gamification: array}
     */
    public function execute(WorkoutSession $session, ?int $durationMinutes, ?string $notes): array
    {
        // Guarda defensiva contra un replay/carrera del cliente: una vez
        // cancelada (ver CancelWorkoutSessionAction), una sesión nunca debe
        // poder terminar completándose de todas formas.
        if ($session->cancelled_at) {
            throw ValidationException::withMessages([
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
        return DB::transaction(function () use ($session, $durationMinutes, $notes) {
            $session->update([
                'completed' => true,
                'duration_minutes' => $durationMinutes ?? $session->duration_minutes,
                'notes' => $notes ?? $session->notes,
            ]);

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
            $gamification = WorkoutCompleted::dispatch($session->user)[0] ?? null;

            return [
                'session' => $session->load('exercises.exercise', 'exercises.sets'),
                'gamification' => $gamification,
            ];
        });
    }
}
