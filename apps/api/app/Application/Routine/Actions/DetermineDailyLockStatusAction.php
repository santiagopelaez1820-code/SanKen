<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de rutina.

namespace App\Application\Routine\Actions;

// Esta línea sirve para importar el objeto que representa el estado del bloqueo diario.
use App\Domain\Routine\ValueObjects\DailyLockStatus;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
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
// Esta línea sirve para declarar la acción que calcula si el entrenamiento de hoy ya se usó.
class DetermineDailyLockStatusAction
{
    // Esta línea sirve para declarar el método que recibe la rutina y devuelve el estado del bloqueo.
    public function execute(Routine $routine): DailyLockStatus
    {
        // Esta línea sirve para guardar el inicio del día de hoy según el servidor.
        $today = now()->startOfDay();

        // Mismo criterio que DetermineNextRoutineDayAction para "turno
        // gastado" (completed=true OR skipped_at no nulo) -- si una sesión
        // rota next_day_id, esa misma sesión es la que bloquea hoy.
        // Esta línea sirve para consultar si hoy ya hubo una sesión que gastó el turno.
        $usedToday = WorkoutSession::query()
            // whereDate() (no where() con un string) -- performed_at se
            // guarda con hora "00:00:00" incluida según el driver, una
            // comparación de string exacta contra toDateString() no
            // matcheaba en sqlite (el driver de test).
            // Esta línea sirve para filtrar por sesiones de hoy.
            ->whereDate('performed_at', $today)
            // Esta línea sirve para filtrar las sesiones completadas o saltadas.
            ->where(fn ($q) => $q->where('completed', true)->orWhereNotNull('skipped_at'))
            // Esta línea sirve para filtrar las que pertenecen a un día de esta rutina.
            ->whereHas('routineDay', fn ($q) => $q->where('routine_id', $routine->id))
            // Esta línea sirve para tomar la más reciente.
            ->latest('id')
            // Esta línea sirve para obtener la primera que coincida.
            ->first();

        // Esta línea sirve para revisar si hoy no hubo ninguna sesión que gaste el turno.
        if (! $usedToday) {
            // Esta línea sirve para devolver el estado desbloqueado.
            return DailyLockStatus::unlocked();
        }

        // Esta línea sirve para devolver el estado bloqueado.
        return new DailyLockStatus(
            // Esta línea sirve para indicar que está bloqueado.
            locked: true,
            // Esta línea sirve para indicar que se desbloquea a las 00:00 del día siguiente.
            unlocksAt: $today->addDay(), // 00:00 del día calendario siguiente (UTC)
            // Esta línea sirve para indicar si el motivo fue completar o saltar la sesión.
            reason: $usedToday->completed ? 'completed' : 'skipped',
        );
    }
}
