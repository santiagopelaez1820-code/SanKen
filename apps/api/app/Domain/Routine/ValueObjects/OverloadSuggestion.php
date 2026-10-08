<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto con la sugerencia de sobrecarga progresiva.
final readonly class OverloadSuggestion
{
    /**
     * @param  int[]  $suggestedRepsPerSet
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el peso sugerido.
        public float $suggestedWeightKg,
        // Esta línea sirve para guardar las repeticiones sugeridas por serie.
        public array $suggestedRepsPerSet,
        // Esta línea sirve para guardar los fallos consecutivos.
        public int $consecutiveFailures,
        // Esta línea sirve para indicar si el usuario cumplió el objetivo.
        public bool $succeeded,
        // Esta línea sirve para indicar si se subió el peso.
        public bool $weightIncreased,
    ) {}
}
