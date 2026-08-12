<?php

namespace App\Domain\Challenges\Services;

use App\Models\WorkoutSet;
use App\Models\WorkoutSession;
use Carbon\CarbonInterface;
use InvalidArgumentException;

/**
 * Calcula el progreso de un usuario para una métrica de reto, dentro de un
 * rango de fechas. Lee directo de workout_sessions/workout_sets — a
 * propósito NO usa user_stats_daily (a diferencia de Rankings): esa tabla se
 * recalcula vía AggregateDailyStatsAction::dispatch() (encolado, no
 * dispatchSync), mientras que el progreso de retos se recalcula de forma
 * síncrona en el mismo request que completa la sesión (ver
 * UpdateChallengeProgressOnWorkoutCompleted) — si dependiera de
 * user_stats_daily, mostraría datos desactualizados salvo que queue:work
 * ya haya procesado el job, que es justo la misma dependencia problemática
 * documentada para la generación de rutinas.
 *
 * Los límites de fecha siempre se comparan con whereDate(), nunca con
 * whereBetween()/igualdad directa contra un string "Y-m-d": performed_at
 * tiene cast `date`, que persiste como datetime completo (Y-m-d H:i:s) al
 * guardar (mismo caso ya documentado en AggregateDailyStatsAction) — un
 * whereBetween ingenuo excluiría de forma silenciosa las sesiones
 * entrenadas justo el último día del rango.
 */
final class ChallengeProgressCalculator
{
    public function calculate(int $userId, string $metric, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        return match ($metric) {
            ChallengeCatalog::METRIC_WORKOUTS_COUNT => $this->workoutsCount($userId, $startsAt, $endsAt),
            ChallengeCatalog::METRIC_TOTAL_VOLUME_KG => $this->totalVolumeKg($userId, $startsAt, $endsAt),
            default => throw new InvalidArgumentException("Métrica de reto desconocida: {$metric}"),
        };
    }

    private function workoutsCount(int $userId, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        return (float) WorkoutSession::query()
            ->where('user_id', $userId)
            ->where('completed', true)
            ->whereDate('performed_at', '>=', $startsAt->toDateString())
            ->whereDate('performed_at', '<=', $endsAt->toDateString())
            ->count();
    }

    private function totalVolumeKg(int $userId, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        $volume = WorkoutSet::query()
            ->join('workout_exercises', 'workout_exercises.id', '=', 'workout_sets.workout_exercise_id')
            ->join('workout_sessions', 'workout_sessions.id', '=', 'workout_exercises.workout_session_id')
            ->where('workout_sessions.user_id', $userId)
            ->where('workout_sessions.completed', true)
            ->whereDate('workout_sessions.performed_at', '>=', $startsAt->toDateString())
            ->whereDate('workout_sessions.performed_at', '<=', $endsAt->toDateString())
            ->where('workout_sets.completed', true)
            ->where('workout_sets.is_warmup', false)
            ->selectRaw('SUM(workout_sets.weight_kg * workout_sets.reps) as total')
            ->value('total');

        return round((float) ($volume ?? 0), 2);
    }
}
