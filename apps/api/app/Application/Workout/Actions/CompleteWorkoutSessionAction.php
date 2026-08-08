<?php

namespace App\Application\Workout\Actions;

use App\Application\Stats\Actions\AggregateDailyStatsAction;
use App\Models\WorkoutSession;

/**
 * Cierra la sesión de entrenamiento y dispara el recálculo de estadísticas
 * diarias (Sprint 5). El cálculo de XP llega en Fase 2 (ver
 * docs/06-roadmap-sprints.md, Sprint 8).
 */
class CompleteWorkoutSessionAction
{
    public function execute(WorkoutSession $session, ?int $durationMinutes, ?string $notes): WorkoutSession
    {
        $session->update([
            'completed' => true,
            'duration_minutes' => $durationMinutes ?? $session->duration_minutes,
            'notes' => $notes ?? $session->notes,
        ]);

        AggregateDailyStatsAction::dispatch($session->user, $session->performed_at->toDateString());

        return $session->load('exercises.exercise', 'exercises.sets');
    }
}
