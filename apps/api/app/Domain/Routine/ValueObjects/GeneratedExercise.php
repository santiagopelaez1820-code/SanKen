<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class GeneratedExercise
{
    public function __construct(
        public int $exerciseId,
        public int $order,
        public int $targetSets,
        public string $targetReps,
        public int $restSeconds,
        public float $targetRpe,
    ) {}
}
