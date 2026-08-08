<?php

namespace App\Domain\Routine\Contracts;

use App\Domain\Routine\ValueObjects\GoalParameters;

interface RoutineStrategyInterface
{
    public function goalParameters(): GoalParameters;

    /**
     * Proporción objetivo de ejercicios compuestos vs. aislamiento (0-1).
     * Fuerza prioriza compuestos casi exclusivamente; resistencia favorece
     * más variedad/aislamiento.
     */
    public function preferredCompoundRatio(): float;
}
