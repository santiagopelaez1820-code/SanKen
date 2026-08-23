<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class SplitDefinition
{
    /**
     * @param  DayDefinition[]  $days
     */
    public function __construct(
        public string $type,
        public array $days,
    ) {}
}
