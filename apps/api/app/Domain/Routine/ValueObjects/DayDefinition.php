<?php

namespace App\Domain\Routine\ValueObjects;

final readonly class DayDefinition
{
    /**
     * @param  string[]  $muscles  slugs de muscle_groups objetivo del día
     */
    public function __construct(
        public string $label,
        public array $muscles,
    ) {}
}
