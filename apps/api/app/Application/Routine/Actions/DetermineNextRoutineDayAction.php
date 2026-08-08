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

        $completedCount = WorkoutSession::query()
            ->where('completed', true)
            ->whereHas('routineDay', fn ($q) => $q->where('routine_id', $routine->id))
            ->count();

        $nextOrder = ($completedCount % $days->count()) + 1;

        return $days->firstWhere('day_order', $nextOrder);
    }
}
