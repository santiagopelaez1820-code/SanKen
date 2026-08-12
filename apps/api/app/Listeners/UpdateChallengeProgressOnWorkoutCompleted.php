<?php

namespace App\Listeners;

use App\Application\Challenges\Actions\RecalculateChallengeProgressAction;
use App\Events\WorkoutCompleted;

/**
 * Fire-and-forget, igual que AwardXpForPrBroken/EvaluateStreakAchievement:
 * no se lee su retorno (ver el fix en CompleteWorkoutSessionAction sobre
 * por qué la respuesta HTTP solo depende del primer listener registrado).
 */
class UpdateChallengeProgressOnWorkoutCompleted
{
    public function handle(WorkoutCompleted $event): void
    {
        RecalculateChallengeProgressAction::dispatchSync($event->user);
    }
}
