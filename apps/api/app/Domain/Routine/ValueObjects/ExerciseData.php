<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

/**
 * Representación plana de un Exercise (Eloquent) para que el dominio pueda
 * trabajar con la biblioteca de ejercicios sin depender del ORM.
 */
// Esta línea sirve para declarar el objeto con los datos de un ejercicio para el motor.
final readonly class ExerciseData
{
    /**
     * @param  string[]  $secondaryMuscles  slugs de muscle_groups
     */
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el id del ejercicio.
        public int $id,
        // Esta línea sirve para guardar el nombre.
        public string $name,
        // Esta línea sirve para guardar el músculo principal.
        public string $primaryMuscle,
        // Esta línea sirve para guardar los músculos secundarios.
        public array $secondaryMuscles,
        // Esta línea sirve para guardar el equipamiento que requiere.
        public string $equipment,
        // Esta línea sirve para guardar el nivel del ejercicio.
        public string $level,
        // Esta línea sirve para guardar el tipo (compuesto o aislado).
        public string $type,
    ) {}
}
