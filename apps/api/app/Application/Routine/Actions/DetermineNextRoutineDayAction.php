<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de rutina.

namespace App\Application\Routine\Actions;

// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineDay (día de rutina).
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;

/**
 * Decide qué día de la rutina le toca al usuario a continuación. No hay un
 * calendario fijo (lunes=Push, etc.): simplemente se rota sobre los días de
 * la rutina según cuántas sesiones completadas lleva acumuladas para ella.
 */
// Esta línea sirve para declarar la acción que decide qué día de la rutina toca a continuación.
class DetermineNextRoutineDayAction
{
    // Esta línea sirve para declarar el método que recibe la rutina y devuelve el próximo día.
    public function execute(Routine $routine): ?RoutineDay
    {
        // Esta línea sirve para obtener los días de la rutina.
        $days = $routine->days;

        // Esta línea sirve para revisar si la rutina no tiene días.
        if ($days->isEmpty()) {
            // Esta línea sirve para devolver null porque no hay día siguiente.
            return null;
        }

        // Una sesión saltada (skipped_at) no completó nada, pero igual
        // "gastó" el turno de ese día — sin esto, saltar un entrenamiento
        // dejaría al usuario viendo el mismo día de nuevo en vez de avanzar
        // al siguiente (sección 4 del pedido).
        // Esta línea sirve para contar las sesiones completadas o saltadas de esta rutina.
        $completedCount = WorkoutSession::query()
            // Esta línea sirve para filtrar las sesiones completadas o saltadas.
            ->where(fn ($q) => $q->where('completed', true)->orWhereNotNull('skipped_at'))
            // Esta línea sirve para filtrar las que pertenecen a un día de esta rutina.
            ->whereHas('routineDay', fn ($q) => $q->where('routine_id', $routine->id))
            // Esta línea sirve para contar cuántas son.
            ->count();

        // Esta línea sirve para calcular el orden del próximo día rotando sobre los días de la rutina.
        $nextOrder = ($completedCount % $days->count()) + 1;

        // Esta línea sirve para devolver el día con ese orden.
        return $days->firstWhere('day_order', $nextOrder);
    }
}
