<?php

namespace App\Application\Workout\Actions;

use App\Application\Stats\Actions\AggregateDailyStatsAction;
use App\Events\WorkoutCompleted;
use App\Models\WorkoutSession;

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
    }
}
