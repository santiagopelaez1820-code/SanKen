<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class GoalParameters
{
    public function __construct(
        public string $targetReps,
        public int $sets,
        public float $rir,
        public int $restSeconds,
    ) {}
}
