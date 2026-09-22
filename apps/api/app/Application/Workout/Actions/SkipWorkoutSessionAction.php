<?php

namespace App\Application\Workout\Actions;

use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
use App\Models\RoutineDay;
use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Validation\ValidationException;

/**
 * Registra que el usuario decidió saltarse el entrenamiento de hoy (seccion 4
 * del pedido). A propósito NO reutiliza StartWorkoutSessionAction: no crea
 * workout_exercises (no hay ejercicios/series/pesos que registrar) y nunca
 * toca routine_exercises/ProgressiveOverloadCalculator — saltar no debe
 * afectar la sobrecarga progresiva de ningún ejercicio.
 */
class SkipWorkoutSessionAction
{
    public function __construct(
        private readonly DetermineDailyLockStatusAction $dailyLock,
    ) {}

    public function execute(User $user, ?RoutineDay $routineDay): WorkoutSession
    {
        // Mismo guardrail que StartWorkoutSessionAction: saltar también
        // "gasta" el turno de hoy (ver DetermineNextRoutineDayAction), así
        // que sin este check un skip repetido sería la forma de saltarse el
        // bloqueo diario avanzando de a un día por request.
        if ($routineDay && $this->dailyLock->execute($routineDay->routine)->locked) {
            throw ValidationException::withMessages([
                'routine_day_id' => ['Ya completaste (o saltaste) tu entrenamiento de hoy. El siguiente se desbloquea a las 00:00.'],
            ]);
        }

        return $user->workoutSessions()->create([
            'routine_day_id' => $routineDay?->id,
            'performed_at' => now()->toDateString(),
            'completed' => false,
            'skipped_at' => now(),
        ]);
    }
}
