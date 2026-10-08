<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de retos.

namespace App\Domain\Challenges\Services;

// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar el modelo WorkoutSet (serie).
use App\Models\WorkoutSet;
// Esta línea sirve para importar la interfaz de fechas de Carbon.
use Carbon\CarbonInterface;
// Esta línea sirve para importar la excepción para métricas desconocidas.
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
// Esta línea sirve para declarar el servicio que calcula el progreso de un usuario en un reto.
final class ChallengeProgressCalculator
{
    // Esta línea sirve para declarar el método que calcula el progreso según la métrica y el rango.
    public function calculate(int $userId, string $metric, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        // Esta línea sirve para elegir el cálculo según la métrica.
        return match ($metric) {
            // Esta línea sirve para contar los entrenamientos del rango si la métrica es esa.
            ChallengeCatalog::METRIC_WORKOUTS_COUNT => $this->workoutsCount($userId, $startsAt, $endsAt),
            // Esta línea sirve para sumar el volumen total en kilos del rango si la métrica es esa.
            ChallengeCatalog::METRIC_TOTAL_VOLUME_KG => $this->totalVolumeKg($userId, $startsAt, $endsAt),
            // Esta línea sirve para cualquier otra métrica produce un error.
            default => throw new InvalidArgumentException("Métrica de reto desconocida: {$metric}"),
        };
    }

    // Esta línea sirve para declarar el método privado que cuenta entrenamientos en un rango.
    private function workoutsCount(int $userId, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        // Esta línea sirve para consultar las sesiones y devolver la cantidad como número decimal.
        return (float) WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $userId)
            // Esta línea sirve para filtrar solo las completadas.
            ->where('completed', true)
            // Esta línea sirve para filtrar desde la fecha de inicio.
            ->whereDate('performed_at', '>=', $startsAt->toDateString())
            // Esta línea sirve para filtrar hasta la fecha de fin.
            ->whereDate('performed_at', '<=', $endsAt->toDateString())
            // Esta línea sirve para contarlas.
            ->count();
    }

    // Esta línea sirve para declarar el método privado que suma el volumen en kilos de un rango.
    private function totalVolumeKg(int $userId, CarbonInterface $startsAt, CarbonInterface $endsAt): float
    {
        // Esta línea sirve para consultar las series.
        $volume = WorkoutSet::query()
            // Esta línea sirve para unir con los ejercicios de la sesión.
            ->join('workout_exercises', 'workout_exercises.id', '=', 'workout_sets.workout_exercise_id')
            // Esta línea sirve para unir con las sesiones.
            ->join('workout_sessions', 'workout_sessions.id', '=', 'workout_exercises.workout_session_id')
            // Esta línea sirve para filtrar por el usuario.
            ->where('workout_sessions.user_id', $userId)
            // Esta línea sirve para filtrar solo sesiones completadas.
            ->where('workout_sessions.completed', true)
            // Esta línea sirve para filtrar desde la fecha de inicio.
            ->whereDate('workout_sessions.performed_at', '>=', $startsAt->toDateString())
            // Esta línea sirve para filtrar hasta la fecha de fin.
            ->whereDate('workout_sessions.performed_at', '<=', $endsAt->toDateString())
            // Esta línea sirve para filtrar solo series completadas.
            ->where('workout_sets.completed', true)
            // Esta línea sirve para excluir las series de calentamiento.
            ->where('workout_sets.is_warmup', false)
            // Esta línea sirve para sumar peso por repeticiones.
            ->selectRaw('SUM(workout_sets.weight_kg * workout_sets.reps) as total')
            // Esta línea sirve para obtener el total.
            ->value('total');

        // Esta línea sirve para devolver el volumen redondeado a 2 decimales (0 si no hay).
        return round((float) ($volume ?? 0), 2);
    }
}
