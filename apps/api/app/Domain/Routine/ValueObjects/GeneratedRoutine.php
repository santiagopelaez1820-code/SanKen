<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto que representa una rutina generada.
final readonly class GeneratedRoutine
{
    /**
     * @param  GeneratedDay[]  $days
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el objetivo de la rutina.
        public string $goal,
        // Esta línea sirve para guardar el tipo de división.
        public string $splitType,
        // Esta línea sirve para guardar los días por semana.
        public int $frequencyDays,
        // Esta línea sirve para guardar la duración en semanas.
        public int $durationWeeks,
        // Esta línea sirve para guardar los días de la rutina.
        public array $days,
    ) {}
}
