<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\RoutineGenerationParams;

/**
 * Traduce nivel + objetivo + tiempo disponible en parámetros concretos de
 * generación (cuántos ejercicios por día, series, reps, descanso, RPE).
 *
 * Dos ejes independientes a propósito, no una tabla plana de 3 niveles x 8
 * objetivos (24 combinaciones a mano, imposible de mantener con criterio):
 *
 * - NIVEL decide volumen (cuántos ejercicios, cuántas series) -- "avanzado"
 *   deliberadamente NO significa más ejercicios (eso es lo que generaba
 *   rutinas gigantes), significa más series con la MISMA selección de
 *   movimientos que intermedio: más capacidad de trabajo, no más variedad.
 * - OBJETIVO decide intensidad (rango de reps, descanso, RPE objetivo) --
 *   fuerza es distinto a hipertrofia es distinto a resistencia
 *   independientemente de qué tan entrenado esté el usuario.
 *
 * El tiempo disponible (session_minutes del onboarding) actúa como techo
 * final sobre el nº de ejercicios: nunca sube el volumen que ya decidió el
 * nivel, solo lo recorta si no entra en el tiempo que el usuario dijo que
 * tiene.
 */
final class RoutineVolumeCalculator
{
    /** Segundos de trabajo activo por serie -- misma cifra que ya usa estimateWorkoutMinutes() en @sanken/core, para que la duración estimada en el cliente y el recorte del servidor coincidan. */
    private const WORK_SECONDS_PER_SET = 45;

    private const MIN_EXERCISES_PER_DAY = 2;

    public function calculate(string $level, string $goal, int $sessionMinutes): RoutineGenerationParams
    {
        ['exercises' => $maxExercises, 'sets' => $sets] = $this->volumeForLevel($level);
        ['reps' => $reps, 'rest' => $rest, 'rpe' => $rpe] = $this->intensityForGoal($goal);

        $maxExercises = min($maxExercises, $this->maxExercisesForDuration($sessionMinutes, $sets, $rest));

        return new RoutineGenerationParams(
            maxExercisesPerDay: $maxExercises,
            setsPerExercise: $sets,
            targetReps: $reps,
            restSeconds: $rest,
            targetRpe: $rpe,
        );
    }

    /**
     * @return array{exercises: int, sets: int}
     */
    private function volumeForLevel(string $level): array
    {
        return match ($level) {
            // Menos ejercicios Y menos series: prioriza aprender técnica sin
            // acumular fatiga innecesaria -- sección 5 del pedido.
            'beginner' => ['exercises' => 4, 'sets' => 3],
            // Misma cantidad de ejercicios que intermedio, una serie más por
            // ejercicio -- más capacidad de trabajo sin diluir la selección
            // en variantes redundantes (sección 5: "avanzado no es más ejercicios").
            'advanced' => ['exercises' => 5, 'sets' => 4],
            default => ['exercises' => 5, 'sets' => 3], // intermediate
        };
    }

    /**
     * @return array{reps: string, rest: int, rpe: float}
     */
    private function intensityForGoal(string $goal): array
    {
        return match ($goal) {
            'strength' => ['reps' => '4-6', 'rest' => 150, 'rpe' => 8.5],
            'sport_performance' => ['reps' => '5-8', 'rest' => 120, 'rpe' => 8.0],
            'gain_muscle' => ['reps' => '8-12', 'rest' => 90, 'rpe' => 8.0],
            'body_recomposition' => ['reps' => '10-12', 'rest' => 60, 'rpe' => 7.5],
            'lose_fat' => ['reps' => '12-15', 'rest' => 45, 'rpe' => 7.5],
            'endurance', 'cardio' => ['reps' => '15-20', 'rest' => 45, 'rpe' => 7.0],
            default => ['reps' => '10-12', 'rest' => 75, 'rpe' => 7.5], // health / fitness general
        };
    }

    /**
     * Cuántos ejercicios entran en el tiempo disponible, asumiendo
     * setsPerExercise series de WORK_SECONDS_PER_SET + el descanso propio
     * del objetivo, por ejercicio. Nunca menos de MIN_EXERCISES_PER_DAY: un
     * día de 1 solo ejercicio no es una sesión razonable aunque el tiempo
     * declarado sea muy corto.
     */
    private function maxExercisesForDuration(int $sessionMinutes, int $setsPerExercise, int $restSeconds): int
    {
        $secondsPerExercise = $setsPerExercise * (self::WORK_SECONDS_PER_SET + $restSeconds);
        $fits = intdiv($sessionMinutes * 60, $secondsPerExercise);

        return max(self::MIN_EXERCISES_PER_DAY, $fits);
    }
}
