<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Disparado sincrónicamente al completar una sesión de entrenamiento
 * (Sprint 8: gamificación). Su único listener otorga XP/logros y devuelve
 * el resultado — ver CompleteWorkoutSessionAction.
 */
class WorkoutCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}
}
