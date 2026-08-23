<?php

namespace App\Domain\Routine\Strategies;

use App\Domain\Routine\Contracts\RoutineStrategyInterface;
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivos: strength, sport_performance.
 * Rango 1-6 reps, RIR 1-3, descanso 2-5min — prioriza casi exclusivamente
 * movimientos compuestos, donde se genera la mayor adaptación de fuerza.
 */
final readonly class StrengthStrategy implements RoutineStrategyInterface
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
        return 0.85;
    }
}
