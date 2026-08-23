<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Representación plana de un Exercise (Eloquent) para que el dominio pueda
 * trabajar con la biblioteca de ejercicios sin depender del ORM.
 */
final readonly class ExerciseData
{
    /**
     * @param  string[]  $secondaryMuscles  slugs de muscle_groups
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $primaryMuscle,
        public array $secondaryMuscles,
        public string $equipment,
        public string $level,
        public string $type,
    ) {}
}
