<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\DayDefinition;
use App\Domain\Routine\ValueObjects\SplitDefinition;

final class SplitSelector
{
    /**
     * @param  array<int, array{type: string, days: array<int, array{label: string, muscles: string[]}>}>  $splitsConfig
     *                                                                                                                    Config completo de routine_engine.splits, indexado por frecuencia semanal.
     */
    public function __construct(
        private readonly array $splitsConfig,
    ) {}

    public function selectFor(int $frequencyDays): SplitDefinition
    {
        $config = $this->splitsConfig[$frequencyDays] ?? $this->closestAvailable($frequencyDays);

        return new SplitDefinition(
            type: $config['type'],
            days: array_map(
                fn (array $day) => new DayDefinition($day['label'], $day['muscles']),
                $config['days'],
            ),
        );
    }

    /**
     * Si la frecuencia no está configurada exactamente, cae al split
     * disponible más cercano en vez de fallar.
     */
    private function closestAvailable(int $frequencyDays): array
    {
        $available = array_keys($this->splitsConfig);
        usort($available, fn ($a, $b) => abs($a - $frequencyDays) <=> abs($b - $frequencyDays));

        return $this->splitsConfig[$available[0]];
    }
}
