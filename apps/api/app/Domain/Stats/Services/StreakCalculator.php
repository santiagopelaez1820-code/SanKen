<?php

namespace App\Domain\Stats\Services;

use Carbon\CarbonImmutable;

/**
 * Racha de días consecutivos entrenando. Tolera un día de descanso: la racha
 * sigue viva si el entrenamiento más reciente fue hoy o ayer respecto a
 * $asOf; si el hueco es de 2+ días, la racha se considera rota (0).
 */
final class StreakCalculator
{
    /**
     * @param  array<int, string>  $workoutDates  Fechas únicas (Y-m-d) en las que el usuario completó al menos un entrenamiento.
     */
    public function calculate(array $workoutDates, CarbonImmutable $asOf): int
    {
        if ($workoutDates === []) {
            return 0;
        }

        $dates = collect($workoutDates)
            ->unique()
            ->map(fn (string $date) => CarbonImmutable::parse($date)->startOfDay())
            ->sortByDesc(fn (CarbonImmutable $date) => $date->timestamp)
            ->values();

        $asOf = $asOf->startOfDay();
        $latest = $dates->first();

        if ($latest->diffInDays($asOf) > 1) {
            return 0;
        }

        $streak = 1;
        $cursor = $latest;

        foreach ($dates->slice(1) as $date) {
            if ($cursor->subDay()->equalTo($date)) {
                $streak++;
                $cursor = $date;

                continue;
            }

            break;
        }

        return $streak;
    }
}
