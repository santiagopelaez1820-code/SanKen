<?php

namespace App\Application\Workout\Actions;

use App\Models\RoutineDay;
use App\Models\User;
use App\Models\WorkoutSession;

/**
 * Registra que el usuario decidió saltarse el entrenamiento de hoy (seccion 4
 * del pedido). A propósito NO reutiliza StartWorkoutSessionAction: no crea
 * workout_exercises (no hay ejercicios/series/pesos que registrar) y nunca
 * toca routine_exercises/ProgressiveOverloadCalculator — saltar no debe
 * afectar la sobrecarga progresiva de ningún ejercicio.
 */
class SkipWorkoutSessionAction
{
    public function execute(User $user, ?RoutineDay $routineDay): WorkoutSession
    {
        return $user->workoutSessions()->create([
            'routine_day_id' => $routineDay?->id,
            'performed_at' => now()->toDateString(),
            'completed' => false,
            'skipped_at' => now(),
        ]);
    }
}
