<?php

namespace App\Domain\Routine\Strategies;

use App\Domain\Routine\Contracts\RoutineStrategyInterface;
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivos: gain_muscle, body_recomposition.
 * Rango 6-15 reps, RIR 1-3, descanso 60-120s — balance entre volumen y carga.
 */
final readonly class HypertrophyStrategy implements RoutineStrategyInterface
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
        return 0.5;
    }
}
