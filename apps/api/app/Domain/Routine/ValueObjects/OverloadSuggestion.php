<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class OverloadSuggestion
{
    /**
     * @param  int[]  $suggestedRepsPerSet
     */
    public function __construct(
        public float $suggestedWeightKg,
        public array $suggestedRepsPerSet,
        public int $consecutiveFailures,
        public bool $succeeded,
        public bool $weightIncreased,
    ) {}
}
