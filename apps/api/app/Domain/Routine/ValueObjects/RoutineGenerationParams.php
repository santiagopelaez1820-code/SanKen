<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Cuánto y qué tan intenso debe ser CADA día de la rutina que se está por
 * generar — calculado por RoutineVolumeCalculator a partir de nivel +
 * objetivo + tiempo disponible del usuario. Reemplaza los valores fijos
 * (3 series, "12" reps, 90s, RPE 8.0 para todo el mundo) que traía cada
 * ejercicio de plantilla por defecto: la plantilla sigue siendo la fuente
 * de qué ejercicios y en qué orden, pero cuánto de eso se usa y con qué
 * series/reps/descanso lo decide esto.
 */
final readonly class RoutineGenerationParams
{
    public function __construct(
        public int $maxExercisesPerDay,
        public int $setsPerExercise,
        public string $targetReps,
        public int $restSeconds,
        public float $targetRpe,
    ) {}
}
