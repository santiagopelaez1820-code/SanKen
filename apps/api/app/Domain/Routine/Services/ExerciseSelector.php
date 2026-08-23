<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\ExerciseData;

/**
 * Filtra y selecciona ejercicios concretos de la biblioteca para un día de
 * rutina, respetando equipo disponible, nivel, lesiones y variedad respecto
 * a días anteriores de la misma rutina.
 */
final class ExerciseSelector
{
    private const LEVEL_RANK = ['beginner' => 1, 'intermediate' => 2, 'advanced' => 3];

    /**
     * Mapeo simple de palabras clave de lesiones a grupos musculares a
     * evitar. Best-effort: no reemplaza criterio médico ni de un entrenador.
     */
    private const INJURY_KEYWORDS = [
        'hombro' => ['shoulders', 'chest', 'triceps'],
        'shoulder' => ['shoulders', 'chest', 'triceps'],
        'rodilla' => ['quads', 'hamstrings', 'glutes'],
        'knee' => ['quads', 'hamstrings', 'glutes'],
        'espalda' => ['back', 'hamstrings', 'glutes'],
        'lumbar' => ['back', 'hamstrings', 'glutes'],
        'back' => ['back', 'hamstrings', 'glutes'],
        'muñeca' => ['biceps', 'triceps', 'chest', 'shoulders'],
        'wrist' => ['biceps', 'triceps', 'chest', 'shoulders'],
        'codo' => ['biceps', 'triceps', 'chest'],
        'elbow' => ['biceps', 'triceps', 'chest'],
        'tobillo' => ['calves', 'quads'],
        'ankle' => ['calves', 'quads'],
    ];

    /**
     * @param  ExerciseData[]  $pool
     * @param  string[]  $targetMuscles  slugs en orden de prioridad
     * @param  string[]  $equipmentAvailable
     * @param  string[]  $injuries
     * @param  int[]  $excludeIds  ejercicios ya usados en días previos de la rutina (se evitan si hay alternativa)
     * @return int[] IDs de ejercicio en orden de ejecución (compuestos primero)
     */
    public function select(
        array $pool,
        array $targetMuscles,
        string $level,
        array $equipmentAvailable,
        array $injuries,
        int $perMuscle,
        int $maxTotal,
        float $compoundRatio,
        array $excludeIds = [],
    ): array {
        $eligible = array_values(array_filter(
            $pool,
            fn (ExerciseData $e) => $this->isEquipmentAvailable($e, $equipmentAvailable)
                && $this->isLevelAppropriate($e, $level)
                && ! $this->isContraindicated($e, $injuries),
        ));

        $picked = [];

        foreach ($targetMuscles as $muscle) {
            $candidates = array_values(array_filter(
                $eligible,
                fn (ExerciseData $e) => $e->primaryMuscle === $muscle && ! in_array($e->id, $picked, true),
            ));

            if ($candidates === []) {
                continue;
            }

            $ranked = $this->rank($candidates, $excludeIds, $compoundRatio, $muscle, $targetMuscles);

            foreach (array_slice($ranked, 0, $perMuscle) as $exercise) {
                $picked[] = $exercise->id;
            }
        }

        if (count($picked) > $maxTotal) {
            $picked = array_slice($picked, 0, $maxTotal);
        }

        return $this->compoundsFirst($eligible, $picked);
    }

    private function isEquipmentAvailable(ExerciseData $exercise, array $equipmentAvailable): bool
    {
        return $exercise->equipment === 'bodyweight_only' || in_array($exercise->equipment, $equipmentAvailable, true);
    }

    private function isLevelAppropriate(ExerciseData $exercise, string $userLevel): bool
    {
        return self::LEVEL_RANK[$exercise->level] <= self::LEVEL_RANK[$userLevel];
    }

    private function isContraindicated(ExerciseData $exercise, array $injuries): bool
    {
        foreach ($injuries as $injury) {
            $injury = mb_strtolower(trim($injury));

            foreach (self::INJURY_KEYWORDS as $keyword => $avoidMuscles) {
                if ($injury !== '' && str_contains($injury, $keyword) && in_array($exercise->primaryMuscle, $avoidMuscles, true)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Prioriza: no usados en días previos > relación compuesto/aislamiento
     * objetivo de la estrategia. El orden de $targetMuscles no afecta el
     * ranking dentro de un músculo, solo se usa como contexto.
     *
     * @param  ExerciseData[]  $candidates
     * @param  int[]  $excludeIds
     * @return ExerciseData[]
     */
    private function rank(array $candidates, array $excludeIds, float $compoundRatio, string $muscle, array $targetMuscles): array
    {
        $unused = array_values(array_filter($candidates, fn (ExerciseData $e) => ! in_array($e->id, $excludeIds, true)));
        $used = array_values(array_filter($candidates, fn (ExerciseData $e) => in_array($e->id, $excludeIds, true)));

        $preferCompound = $compoundRatio >= 0.5;
        $sorter = function (ExerciseData $a, ExerciseData $b) use ($preferCompound) {
            $aCompound = $a->type === 'compound';
            $bCompound = $b->type === 'compound';

            if ($aCompound === $bCompound) {
                return 0;
            }

            return ($aCompound === $preferCompound) ? -1 : 1;
        };

        usort($unused, $sorter);
        usort($used, $sorter);

        return [...$unused, ...$used];
    }

    /**
     * Reordena la selección final: compuestos primero (se ejecutan con más
     * frescura), preservando el orden relativo dentro de cada grupo.
     *
     * @param  ExerciseData[]  $pool
     * @param  int[]  $pickedIds
     * @return int[]
     */
    private function compoundsFirst(array $pool, array $pickedIds): array
    {
        $byId = [];
        foreach ($pool as $exercise) {
            $byId[$exercise->id] = $exercise;
        }

        $compounds = array_values(array_filter($pickedIds, fn (int $id) => ($byId[$id]->type ?? null) === 'compound'));
        $others = array_values(array_filter($pickedIds, fn (int $id) => ($byId[$id]->type ?? null) !== 'compound'));

        return [...$compounds, ...$others];
    }
}
