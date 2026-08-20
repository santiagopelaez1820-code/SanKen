<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Cómo le fue al usuario en la última sesión para un ejercicio concreto,
 * SERIE POR SERIE (no promediado) — es la entrada del
 * ProgressiveOverloadCalculator. `actualRepsPerSet`/`actualWeightPerSet`
 * están en orden de set_number y solo incluyen series de trabajo
 * (is_warmup=false, completed=true); su longitud puede ser menor a
 * targetSets si el usuario no llegó a completar todas.
 */
final readonly class PerformanceSummary
{
    /**
     * @param  int[]  $actualRepsPerSet
     * @param  float[]  $actualWeightPerSet
     * @param  int[]|null  $targetRepsPerSet  Objetivo vigente antes de esta sesión (null = todavía no hay rampa, primera vez).
     */
    public function __construct(
        public int $targetSets,
        public array $actualRepsPerSet,
        public array $actualWeightPerSet,
        public ?array $targetRepsPerSet,
        public bool $completedAsPlanned,
    ) {}
}
