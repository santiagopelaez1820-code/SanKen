<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class OverloadSuggestion
{
    public function __construct(
        public float $suggestedWeightKg,
        public int $consecutiveFailures,
        public bool $succeeded,
        public bool $deloaded,
    ) {}
}
