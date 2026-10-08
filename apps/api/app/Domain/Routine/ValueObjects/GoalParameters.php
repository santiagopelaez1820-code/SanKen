<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto con los parámetros de un objetivo.
final readonly class GoalParameters
{
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el rango de repeticiones.
        public string $targetReps,
        // Esta línea sirve para guardar la cantidad de series.
        public int $sets,
        // Esta línea sirve para guardar las repeticiones en reserva (RIR).
        public float $rir,
        // Esta línea sirve para guardar los segundos de descanso.
        public int $restSeconds,
    ) {}
}
