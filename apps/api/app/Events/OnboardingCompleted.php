<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Disparado cuando un usuario termina el onboarding. A partir del Sprint 2,
 * un listener en cola escucha este evento y dispara GenerateRoutineAction.
 */
class OnboardingCompleted
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}
}
