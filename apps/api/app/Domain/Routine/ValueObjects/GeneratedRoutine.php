<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class GeneratedRoutine
{
    /**
     * @param  GeneratedDay[]  $days
     */
    public function __construct(
        public string $goal,
        public string $splitType,
        public int $frequencyDays,
        public int $durationWeeks,
        public array $days,
    ) {}
}
