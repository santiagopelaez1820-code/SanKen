<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto que representa un ejercicio generado.
final readonly class GeneratedExercise
{
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el id del ejercicio.
        public int $exerciseId,
        // Esta línea sirve para guardar la posición del ejercicio.
        public int $order,
        // Esta línea sirve para guardar las series objetivo.
        public int $targetSets,
        // Esta línea sirve para guardar las repeticiones objetivo.
        public string $targetReps,
        // Esta línea sirve para guardar los segundos de descanso.
        public int $restSeconds,
        // Esta línea sirve para guardar el RPE objetivo.
        public float $targetRpe,
    ) {}
}
