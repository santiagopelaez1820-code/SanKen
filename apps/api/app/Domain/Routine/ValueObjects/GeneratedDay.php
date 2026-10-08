<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto que representa un día generado.
final readonly class GeneratedDay
{
    /**
     * @param  string[]  $targetMuscleGroups
     * @param  GeneratedExercise[]  $exercises
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el orden del día.
        public int $order,
        // Esta línea sirve para guardar la etiqueta del día.
        public string $label,
        // Esta línea sirve para guardar los grupos musculares del día.
        public array $targetMuscleGroups,
        // Esta línea sirve para guardar los ejercicios del día.
        public array $exercises,
    ) {}
}
