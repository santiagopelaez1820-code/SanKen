<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\OverloadSuggestion;
use App\Domain\Routine\ValueObjects\PerformanceSummary;

/**
 * Decide el peso sugerido para la próxima vez que el usuario haga este
 * ejercicio. Regla de oro (ver docs/01-arquitectura.md §6): nunca sube el
 * peso si el usuario no completó el objetivo — como mucho, lo mantiene.
 *
 * Ejemplo de referencia (100kg → 102.5kg → 105kg con incrementos de 2.5kg):
 * $calc->calculate($perfConLogro100kg, 'barbell', 0)->suggestedWeightKg === 102.5
 */
final class ProgressiveOverloadCalculator
{
    private const SMALL_INCREMENT_EQUIPMENT = ['dumbbells', 'kettlebells', 'cables', 'resistance_bands'];

    private const FAILURES_BEFORE_DELOAD = 2;

    private const INCREMENT_RATIO = 0.025;

    private const DELOAD_RATIO = 0.9;

    public function calculate(PerformanceSummary $performance, string $equipment, int $consecutiveFailures): OverloadSuggestion
    {
        $succeeded = $performance->completedAsPlanned
            && $performance->actualSets >= $performance->targetSets
            && $performance->averageReps >= $performance->targetRepsMin;

        if ($succeeded) {
            return new OverloadSuggestion(
                suggestedWeightKg: $this->increment($performance->topWeightUsed, $equipment),
                consecutiveFailures: 0,
                succeeded: true,
                deloaded: false,
            );
        }

        $failures = $consecutiveFailures + 1;

        if ($failures >= self::FAILURES_BEFORE_DELOAD) {
            return new OverloadSuggestion(
                suggestedWeightKg: $this->deload($performance->topWeightUsed, $equipment),
                consecutiveFailures: 0,
                succeeded: false,
                deloaded: true,
            );
        }

        return new OverloadSuggestion(
            suggestedWeightKg: $performance->topWeightUsed,
            consecutiveFailures: $failures,
            succeeded: false,
            deloaded: false,
        );
    }

    private function increment(float $weight, string $equipment): float
    {
        if ($weight <= 0) {
            return 0.0;
        }

        $step = $this->stepFor($equipment);
        $rawIncrement = $weight * self::INCREMENT_RATIO;
        $increment = max($step, round($rawIncrement / $step) * $step);

        return round($weight + $increment, 2);
    }

    private function deload(float $weight, string $equipment): float
    {
        if ($weight <= 0) {
            return 0.0;
        }

        $step = $this->stepFor($equipment);
        $reduced = $weight * self::DELOAD_RATIO;

        return round(floor($reduced / $step) * $step, 2);
    }

    private function stepFor(string $equipment): float
    {
        return in_array($equipment, self::SMALL_INCREMENT_EQUIPMENT, true) ? 1.0 : 2.5;
    }
}
