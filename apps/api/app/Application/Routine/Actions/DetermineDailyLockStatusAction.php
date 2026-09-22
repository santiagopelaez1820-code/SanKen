<?php

namespace App\Application\Routine\Actions;

use App\Domain\Routine\ValueObjects\DailyLockStatus;
use App\Models\Routine;
use App\Models\WorkoutSession;

/**
 * Desbloqueo diario: una vez que el usuario completa (o salta -- ver
 * DetermineNextRoutineDayAction, saltar también "gasta" el turno) el
 * entrenamiento de hoy para esta rutina, el siguiente día de rutina queda
 * bloqueado hasta las 00:00 del día calendario siguiente.
 *
 * La referencia es SIEMPRE now() del servidor -- nunca una fecha que mande
 * el cliente (StartWorkoutSessionRequest ni siquiera acepta un campo de
 * fecha) -- así que ni cambiar la hora del dispositivo ni manipular la
 * request adelanta el desbloqueo. El proyecto corre en UTC de punta a punta
 * (config('app.timezone'), ver también performed_at más abajo) así que "día
 * calendario" acá significa día calendario UTC, consistente con cómo ya se
 * calcula performed_at en Start/SkipWorkoutSessionAction -- no hay timezone
 * de usuario guardada en ningún lado del proyecto, y mezclar UTC para
 * performed_at con otra zona para el desbloqueo generaría desfases de un día
 * entre ambos. Documentado también en el resumen de la feature.
 */
class DetermineDailyLockStatusAction
{
    public function execute(Routine $routine): DailyLockStatus
    {
        $today = now()->startOfDay();

        // Mismo criterio que DetermineNextRoutineDayAction para "turno
        // gastado" (completed=true OR skipped_at no nulo) -- si una sesión
        // rota next_day_id, esa misma sesión es la que bloquea hoy.
        $usedToday = WorkoutSession::query()
            // whereDate() (no where() con un string) -- performed_at se
            // guarda con hora "00:00:00" incluida según el driver, una
            // comparación de string exacta contra toDateString() no
            // matcheaba en sqlite (el driver de test).
            ->whereDate('performed_at', $today)
            ->where(fn ($q) => $q->where('completed', true)->orWhereNotNull('skipped_at'))
            ->whereHas('routineDay', fn ($q) => $q->where('routine_id', $routine->id))
            ->latest('id')
            ->first();

        if (! $usedToday) {
            return DailyLockStatus::unlocked();
        }

        return new DailyLockStatus(
            locked: true,
            unlocksAt: $today->addDay(), // 00:00 del día calendario siguiente (UTC)
            reason: $usedToday->completed ? 'completed' : 'skipped',
        );
    }
}
