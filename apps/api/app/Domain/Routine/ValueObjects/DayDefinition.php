<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para declarar el objeto que define un día de la división.
final readonly class DayDefinition
{
    /**
     * @param  string[]  $muscles  slugs de muscle_groups objetivo del día
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar la etiqueta del día.
        public string $label,
        // Esta línea sirve para guardar los músculos objetivo del día.
        public array $muscles,
    ) {}
}
