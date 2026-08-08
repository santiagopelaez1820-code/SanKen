<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class GeneratedDay
{
    /**
     * @param  string[]  $targetMuscleGroups
     * @param  GeneratedExercise[]  $exercises
     */
    public function __construct(
        public int $order,
        public string $label,
        public array $targetMuscleGroups,
        public array $exercises,
    ) {}
}
