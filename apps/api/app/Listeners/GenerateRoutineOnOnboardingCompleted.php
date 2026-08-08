<?php

namespace App\Listeners;

use App\Application\Routine\Actions\GenerateRoutineAction;
use App\Events\OnboardingCompleted;

class GenerateRoutineOnOnboardingCompleted
{
    public function handle(OnboardingCompleted $event): void
    {
        GenerateRoutineAction::dispatch($event->user);
    }
}
