<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto que define una división completa.
final readonly class SplitDefinition
{
    /**
     * @param  DayDefinition[]  $days
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el tipo de división.
        public string $type,
        // Esta línea sirve para guardar los días de la división.
        public array $days,
    ) {}
}
