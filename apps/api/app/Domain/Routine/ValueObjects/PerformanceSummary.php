<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

/**
 * Cómo le fue al usuario en la última sesión para un ejercicio concreto,
 * SERIE POR SERIE (no promediado) — es la entrada del
 * ProgressiveOverloadCalculator. `actualRepsPerSet`/`actualWeightPerSet`
 * están en orden de set_number y solo incluyen series de trabajo
 * (is_warmup=false, completed=true); su longitud puede ser menor a
 * targetSets si el usuario no llegó a completar todas.
 */
// Esta línea sirve para declarar el objeto que resume el rendimiento en un ejercicio.
final readonly class PerformanceSummary
{
    /**
     * @param  int[]  $actualRepsPerSet
     * @param  float[]  $actualWeightPerSet
     * @param  int[]|null  $targetRepsPerSet  Objetivo vigente antes de esta sesión (null = todavía no hay rampa, primera vez).
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar las series objetivo.
        public int $targetSets,
        // Esta línea sirve para guardar las repeticiones hechas en cada serie.
        public array $actualRepsPerSet,
        // Esta línea sirve para guardar el peso usado en cada serie.
        public array $actualWeightPerSet,
        // Esta línea sirve para guardar los objetivos de repeticiones vigentes (o null).
        public ?array $targetRepsPerSet,
        // Esta línea sirve para guardar si se completó como estaba planeado.
        public bool $completedAsPlanned,
    ) {}
}
