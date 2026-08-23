<?php

namespace App\Domain\Routine\Strategies;

use App\Domain\Routine\Contracts\RoutineStrategyInterface;
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivos: endurance, health, cardio.
 * Reps altas, descansos cortos, mayor variedad de aislamiento — prioriza
 * capacidad de trabajo y salud general sobre carga máxima.
 */
final readonly class EnduranceStrategy implements RoutineStrategyInterface
{
    public function __construct(
        private GoalParameters $parameters,
    ) {}

    public function goalParameters(): GoalParameters
    {
        return $this->parameters;
    }

    public function preferredCompoundRatio(): float
    {
        return 0.4;
    }
}
