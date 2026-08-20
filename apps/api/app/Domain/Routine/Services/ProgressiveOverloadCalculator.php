<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\OverloadSuggestion;
use App\Domain\Routine\ValueObjects\PerformanceSummary;

/**
 * Decide el objetivo (reps por serie + peso) para la próxima vez que el
 * usuario haga este ejercicio. Doble progresión, serie por serie:
 *
 * 1. Primero rampea REPETICIONES a peso constante, +1 por serie a partir
 *    de lo que REALMENTE logró en esa misma serie (no un promedio),
 *    con techo REPS_CEILING (12).
 * 2. El peso solo sube cuando el objetivo YA estaba en el techo en todas
 *    las series y el usuario lo cumplió de nuevo esta vez — recién ahí
 *    "consiguió completar el objetivo de repeticiones establecido" (ver
 *    el pedido del usuario). Al subir el peso, las reps vuelven al piso
 *    del rango original de la rutina (target_reps mínimo).
 * 3. Si falla (no completa todas las series, o alguna serie queda por
 *    debajo de su objetivo vigente), el objetivo se mantiene igual —
 *    nunca baja, nunca sube "porque entrenó". No hay deload de peso: a
 *    diferencia de la versión anterior de este calculador, acá una falla
 *    nunca reduce el peso, solo sostiene el objetivo hasta que lo logre.
 *
 * Ejemplo de referencia (ver PersonalRecordsTest/ProgressiveOverloadCalculatorTest):
 * sin objetivo previo, actual [10,9,9] → sugiere [11,10,10] al mismo peso.
 */
final class ProgressiveOverloadCalculator
{
    private const SMALL_INCREMENT_EQUIPMENT = ['dumbbells', 'kettlebells', 'cables', 'resistance_bands'];

    private const REPS_CEILING = 12;

    private const INCREMENT_RATIO = 0.025;

    public function calculate(
        PerformanceSummary $performance,
        string $equipment,
        int $consecutiveFailures,
        int $floorReps,
    ): OverloadSuggestion {
        $weightUsed = $performance->actualWeightPerSet === [] ? 0.0 : max($performance->actualWeightPerSet);
        $priorTargets = $performance->targetRepsPerSet;
        $succeeded = $performance->completedAsPlanned
            && $this->metEveryTarget($performance->actualRepsPerSet, $priorTargets, $performance->targetSets);

        if (! $succeeded) {
            // Sin objetivo previo (primera vez) y falla (no completó todas
            // las series): no hay nada que "sostener" todavía, arranca del
            // piso del rango original en vez de un array vacío.
            return new OverloadSuggestion(
                suggestedWeightKg: $weightUsed,
                suggestedRepsPerSet: $priorTargets ?? array_fill(0, $performance->targetSets, $floorReps),
                consecutiveFailures: $consecutiveFailures + 1,
                succeeded: false,
                weightIncreased: false,
            );
        }

        if ($priorTargets !== null && $this->allAtCeiling($priorTargets)) {
            return new OverloadSuggestion(
                suggestedWeightKg: $this->increment($weightUsed, $equipment),
                suggestedRepsPerSet: array_fill(0, $performance->targetSets, $floorReps),
                consecutiveFailures: 0,
                succeeded: true,
                weightIncreased: true,
            );
        }

        return new OverloadSuggestion(
            suggestedWeightKg: $weightUsed,
            suggestedRepsPerSet: $this->rampReps($performance->actualRepsPerSet, $performance->targetSets),
            consecutiveFailures: 0,
            succeeded: true,
            weightIncreased: false,
        );
    }

    /**
     * @param  int[]  $actual
     * @param  int[]|null  $targets  null = todavía no hay rampa (primera vez con este ejercicio) — alcanza con haber completado todas las series.
     */
    private function metEveryTarget(array $actual, ?array $targets, int $targetSets): bool
    {
        if ($targets === null) {
            return count($actual) >= $targetSets;
        }

        for ($i = 0; $i < $targetSets; $i++) {
            if (($actual[$i] ?? 0) < ($targets[$i] ?? PHP_INT_MAX)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  int[]  $targets
     */
    private function allAtCeiling(array $targets): bool
    {
        foreach ($targets as $target) {
            if ($target < self::REPS_CEILING) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param  int[]  $actual
     * @return int[]
     */
    private function rampReps(array $actual, int $targetSets): array
    {
        return array_map(
            fn (int $i) => min(self::REPS_CEILING, ($actual[$i] ?? 0) + 1),
            range(0, $targetSets - 1),
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

    private function stepFor(string $equipment): float
    {
        return in_array($equipment, self::SMALL_INCREMENT_EQUIPMENT, true) ? 1.0 : 2.5;
    }
}
