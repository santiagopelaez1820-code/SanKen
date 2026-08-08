<?php

namespace App\Domain\Routine\Strategies;

use App\Domain\Routine\Contracts\RoutineStrategyInterface;
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivo: lose_fat.
 * Reps más altas y descansos cortos para elevar el estrés metabólico,
 * manteniendo suficientes compuestos para preservar masa muscular.
 */
final readonly class FatLossStrategy implements RoutineStrategyInterface
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
        return 0.6;
    }
}
