<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Resumen de cómo le fue al usuario en la última sesión para un ejercicio
 * concreto, comparado contra lo que la rutina pedía. Es la entrada del
 * ProgressiveOverloadCalculator.
 */
final readonly class PerformanceSummary
{
    public function __construct(
        public int $targetSets,
        public int $targetRepsMin,
        public int $actualSets,
        public float $averageReps,
        public float $topWeightUsed,
        public bool $completedAsPlanned,
    ) {}
}
