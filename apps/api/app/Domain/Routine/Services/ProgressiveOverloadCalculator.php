<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rutina.

namespace App\Domain\Routine\Services;

// Esta línea sirve para importar el objeto con la sugerencia de sobrecarga.
use App\Domain\Routine\ValueObjects\OverloadSuggestion;
// Esta línea sirve para importar el objeto que resume el rendimiento.
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
// Esta línea sirve para declarar el servicio que calcula la sobrecarga progresiva.
final class ProgressiveOverloadCalculator
{
    // Esta línea sirve para definir los equipamientos que suben el peso de a poco (1 kg).
    private const SMALL_INCREMENT_EQUIPMENT = ['dumbbells', 'kettlebells', 'cables', 'resistance_bands'];

    // Esta línea sirve para definir el techo de repeticiones (12).
    private const REPS_CEILING = 12;

    // Esta línea sirve para definir el aumento de peso como 2,5% del peso usado.
    private const INCREMENT_RATIO = 0.025;

    // Esta línea sirve para declarar el método que calcula la sugerencia para la próxima sesión.
    public function calculate(
        // Esta línea sirve para recibir el resumen de rendimiento.
        PerformanceSummary $performance,
        // Esta línea sirve para recibir el equipamiento del ejercicio.
        string $equipment,
        // Esta línea sirve para recibir cuántas veces seguidas falló.
        int $consecutiveFailures,
        // Esta línea sirve para recibir el piso de repeticiones del rango original.
        int $floorReps,
        // Esta línea sirve para indicar que el método devuelve una sugerencia de sobrecarga.
    ): OverloadSuggestion {
        // Esta línea sirve para obtener el peso más alto usado (0 si no hubo series).
        $weightUsed = $performance->actualWeightPerSet === [] ? 0.0 : max($performance->actualWeightPerSet);
        // Esta línea sirve para obtener los objetivos de repeticiones vigentes.
        $priorTargets = $performance->targetRepsPerSet;
        // Esta línea sirve para calcular si cumplió: completó lo planeado.
        $succeeded = $performance->completedAsPlanned
            // Esta línea sirve para exigir además que llegó al objetivo en todas las series.
            && $this->metEveryTarget($performance->actualRepsPerSet, $priorTargets, $performance->targetSets);

        // Esta línea sirve para revisar si no lo cumplió.
        if (! $succeeded) {
            // Sin objetivo previo (primera vez) y falla (no completó todas
            // las series): no hay nada que "sostener" todavía, arranca del
            // piso del rango original en vez de un array vacío.
            // Esta línea sirve para devolver una sugerencia que mantiene el objetivo.
            return new OverloadSuggestion(
                // Esta línea sirve para mantener el mismo peso.
                suggestedWeightKg: $weightUsed,
                // Esta línea sirve para mantener los objetivos, o usar el piso si no había objetivos.
                suggestedRepsPerSet: $priorTargets ?? array_fill(0, $performance->targetSets, $floorReps),
                // Esta línea sirve para sumar un fallo consecutivo.
                consecutiveFailures: $consecutiveFailures + 1,
                // Esta línea sirve para indicar que no lo cumplió.
                succeeded: false,
                // Esta línea sirve para indicar que no subió el peso.
                weightIncreased: false,
            );
        }

        // Esta línea sirve para revisar si ya estaba en el techo de repeticiones en todas las series.
        if ($priorTargets !== null && $this->allAtCeiling($priorTargets)) {
            // Esta línea sirve para devolver una sugerencia que sube el peso.
            return new OverloadSuggestion(
                // Esta línea sirve para aumentar el peso según el equipamiento.
                suggestedWeightKg: $this->increment($weightUsed, $equipment),
                // Esta línea sirve para volver las repeticiones al piso del rango.
                suggestedRepsPerSet: array_fill(0, $performance->targetSets, $floorReps),
                // Esta línea sirve para reiniciar los fallos consecutivos.
                consecutiveFailures: 0,
                // Esta línea sirve para indicar que lo cumplió.
                succeeded: true,
                // Esta línea sirve para indicar que subió el peso.
                weightIncreased: true,
            );
        }

        // Esta línea sirve para devolver una sugerencia que sube las repeticiones.
        return new OverloadSuggestion(
            // Esta línea sirve para mantener el mismo peso.
            suggestedWeightKg: $weightUsed,
            // Esta línea sirve para sumar una repetición por serie a lo logrado.
            suggestedRepsPerSet: $this->rampReps($performance->actualRepsPerSet, $performance->targetSets),
            // Esta línea sirve para reiniciar los fallos consecutivos.
            consecutiveFailures: 0,
            // Esta línea sirve para indicar que lo cumplió.
            succeeded: true,
            // Esta línea sirve para indicar que no subió el peso.
            weightIncreased: false,
        );
    }

    /**
     * @param  int[]  $actual
     * @param  int[]|null  $targets  null = todavía no hay rampa (primera vez con este ejercicio) — alcanza con haber completado todas las series.
     */
    // Esta línea sirve para declarar el método privado que revisa si se cumplieron todos los objetivos.
    private function metEveryTarget(array $actual, ?array $targets, int $targetSets): bool
    {
        // Esta línea sirve para revisar si no había objetivos previos.
        if ($targets === null) {
            // Esta línea sirve para aceptar si completó todas las series.
            return count($actual) >= $targetSets;
        }

        // Esta línea sirve para recorrer cada serie objetivo.
        for ($i = 0; $i < $targetSets; $i++) {
            // Esta línea sirve para revisar si la serie quedó por debajo de su objetivo.
            if (($actual[$i] ?? 0) < ($targets[$i] ?? PHP_INT_MAX)) {
                // Esta línea sirve para devolver falso porque no lo cumplió.
                return false;
            }
        }

        // Esta línea sirve para devolver verdadero porque cumplió todas las series.
        return true;
    }

    /**
     * @param  int[]  $targets
     */
    // Esta línea sirve para declarar el método privado que revisa si todos los objetivos están en el techo.
    private function allAtCeiling(array $targets): bool
    {
        // Esta línea sirve para recorrer cada objetivo.
        foreach ($targets as $target) {
            // Esta línea sirve para revisar si alguno está por debajo del techo.
            if ($target < self::REPS_CEILING) {
                // Esta línea sirve para devolver falso.
                return false;
            }
        }

        // Esta línea sirve para devolver verdadero porque todos están en el techo.
        return true;
    }

    /**
     * @param  int[]  $actual
     * @return int[]
     */
    // Esta línea sirve para declarar el método privado que sube una repetición por serie.
    private function rampReps(array $actual, int $targetSets): array
    {
        // Esta línea sirve para devolver la lista de objetivos nuevos.
        return array_map(
            // Esta línea sirve para sumar una repetición a lo logrado sin pasar el techo.
            fn (int $i) => min(self::REPS_CEILING, ($actual[$i] ?? 0) + 1),
            // Esta línea sirve para recorrer cada serie objetivo.
            range(0, $targetSets - 1),
        );
    }

    // Esta línea sirve para declarar el método privado que aumenta el peso.
    private function increment(float $weight, string $equipment): float
    {
        // Esta línea sirve para revisar si no hay peso.
        if ($weight <= 0) {
            // Esta línea sirve para devolver 0.
            return 0.0;
        }

        // Esta línea sirve para obtener el salto mínimo según el equipamiento.
        $step = $this->stepFor($equipment);
        // Esta línea sirve para calcular el aumento como porcentaje del peso.
        $rawIncrement = $weight * self::INCREMENT_RATIO;
        // Esta línea sirve para redondear el aumento al salto del equipamiento (mínimo un salto).
        $increment = max($step, round($rawIncrement / $step) * $step);

        // Esta línea sirve para devolver el peso nuevo redondeado a 2 decimales.
        return round($weight + $increment, 2);
    }

    // Esta línea sirve para declarar el método privado que devuelve el salto de peso del equipamiento.
    private function stepFor(string $equipment): float
    {
        // Esta línea sirve para devolver 1 kg para mancuernas y similares, o 2,5 kg para el resto.
        return in_array($equipment, self::SMALL_INCREMENT_EQUIPMENT, true) ? 1.0 : 2.5;
    }
}
