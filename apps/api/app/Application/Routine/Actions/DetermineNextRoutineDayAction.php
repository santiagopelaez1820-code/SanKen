<?php

namespace App\Application\Routine\Actions;

use App\Models\Routine;
use App\Models\RoutineDay;
use App\Models\WorkoutSession;

/**
 * Decide qué día de la rutina le toca al usuario a continuación. No hay un
 * calendario fijo (lunes=Push, etc.): simplemente se rota sobre los días de
 * la rutina según cuántas sesiones completadas lleva acumuladas para ella.
 */
class DetermineNextRoutineDayAction
{
    public function execute(Routine $routine): ?RoutineDay
    {
        $days = $routine->days;

        if ($days->isEmpty()) {
            return null;
        }

        // Una sesión saltada (skipped_at) no completó nada, pero igual
        // "gastó" el turno de ese día — sin esto, saltar un entrenamiento
        // dejaría al usuario viendo el mismo día de nuevo en vez de avanzar
        // al siguiente (sección 4 del pedido).
        $completedCount = WorkoutSession::query()
            ->where(fn ($q) => $q->where('completed', true)->orWhereNotNull('skipped_at'))
            ->whereHas('routineDay', fn ($q) => $q->where('routine_id', $routine->id))
            ->count();

        $nextOrder = ($completedCount % $days->count()) + 1;

        return $days->firstWhere('day_order', $nextOrder);
    }
}
