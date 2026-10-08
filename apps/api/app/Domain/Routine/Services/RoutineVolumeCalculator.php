<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rutina.

namespace App\Domain\Routine\Services;

// Esta línea sirve para importar el objeto con los parámetros de generación de una rutina.
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
 * tiene -- siempre dentro del rango 6-8 ejercicios por día.
 */
// Esta línea sirve para declarar el servicio que calcula el volumen e intensidad de la rutina.
final class RoutineVolumeCalculator
{
    /** Segundos de trabajo activo por serie -- misma cifra que ya usa estimateWorkoutMinutes() en @sanken/core, para que la duración estimada en el cliente y el recorte del servidor coincidan. */
    // Esta línea sirve para definir los segundos de trabajo activo por serie.
    private const WORK_SECONDS_PER_SET = 45;

    /** Rango de ejercicios por día que exige el producto: nunca menos de 6 ni más de 8. */
    // Esta línea sirve para definir el mínimo de ejercicios por día (6).
    public const MIN_EXERCISES_PER_DAY = 6;

    // Esta línea sirve para definir el máximo de ejercicios por día (8).
    public const MAX_EXERCISES_PER_DAY = 8;

    // Esta línea sirve para declarar el método que calcula los parámetros según nivel, objetivo y tiempo.
    public function calculate(string $level, string $goal, int $sessionMinutes): RoutineGenerationParams
    {
        // Esta línea sirve para obtener el máximo de ejercicios y las series según el nivel.
        ['exercises' => $maxExercises, 'sets' => $sets] = $this->volumeForLevel($level);
        // Esta línea sirve para obtener repeticiones, descanso y RPE según el objetivo.
        ['reps' => $reps, 'rest' => $rest, 'rpe' => $rpe] = $this->intensityForGoal($goal);

        // Esta línea sirve para recortar los ejercicios si no entran en el tiempo disponible.
        $maxExercises = min($maxExercises, $this->maxExercisesForDuration($sessionMinutes, $sets, $rest));

        // Esta línea sirve para devolver los parámetros de generación.
        return new RoutineGenerationParams(
            // Esta línea sirve para pasar el máximo de ejercicios por día.
            maxExercisesPerDay: $maxExercises,
            // Esta línea sirve para pasar las series por ejercicio.
            setsPerExercise: $sets,
            // Esta línea sirve para pasar el rango de repeticiones.
            targetReps: $reps,
            // Esta línea sirve para pasar los segundos de descanso.
            restSeconds: $rest,
            // Esta línea sirve para pasar el RPE objetivo.
            targetRpe: $rpe,
        );
    }

    /**
     * @return array{exercises: int, sets: int}
     */
    // Esta línea sirve para declarar el método privado que define el volumen según el nivel.
    private function volumeForLevel(string $level): array
    {
        // Esta línea sirve para elegir el volumen según el nivel.
        return match ($level) {
            // Menos ejercicios Y menos series: prioriza aprender técnica sin
            // acumular fatiga innecesaria -- sección 5 del pedido. Aun así,
            // nunca por debajo del mínimo de 6 ejercicios por día.
            // Esta línea sirve para asignar al principiante 6 ejercicios con 3 series.
            'beginner' => ['exercises' => self::MIN_EXERCISES_PER_DAY, 'sets' => 3],
            // Misma cantidad de ejercicios que intermedio, una serie más por
            // ejercicio -- más capacidad de trabajo sin diluir la selección
            // en variantes redundantes (sección 5: "avanzado no es más ejercicios").
            // Esta línea sirve para asignar al avanzado 8 ejercicios con 4 series.
            'advanced' => ['exercises' => self::MAX_EXERCISES_PER_DAY, 'sets' => 4],
            // Esta línea sirve para asignar al intermedio (por defecto) 8 ejercicios con 3 series.
            default => ['exercises' => self::MAX_EXERCISES_PER_DAY, 'sets' => 3], // intermediate
        };
    }

    /**
     * @return array{reps: string, rest: int, rpe: float}
     */
    // Esta línea sirve para declarar el método privado que define la intensidad según el objetivo.
    private function intensityForGoal(string $goal): array
    {
        // Esta línea sirve para elegir la intensidad según el objetivo.
        return match ($goal) {
            // Esta línea sirve para asignar a fuerza 4-6 repeticiones, 150 s de descanso y RPE 8,5.
            'strength' => ['reps' => '4-6', 'rest' => 150, 'rpe' => 8.5],
            // Esta línea sirve para asignar a rendimiento deportivo 5-8 repeticiones, 120 s y RPE 8.
            'sport_performance' => ['reps' => '5-8', 'rest' => 120, 'rpe' => 8.0],
            // Esta línea sirve para ganar músculo: 8-12 repeticiones, 90 s, RPE 8.
            'gain_muscle' => ['reps' => '8-12', 'rest' => 90, 'rpe' => 8.0],
            // Esta línea sirve para asignar a recomposición corporal 10-12 repeticiones, 60 s y RPE 7,5.
            'body_recomposition' => ['reps' => '10-12', 'rest' => 60, 'rpe' => 7.5],
            // Esta línea sirve para perder grasa: 12-15 repeticiones, 45 s, RPE 7,5.
            'lose_fat' => ['reps' => '12-15', 'rest' => 45, 'rpe' => 7.5],
            // Esta línea sirve para asignar a resistencia y cardio 15-20 repeticiones, 45 s y RPE 7.
            'endurance', 'cardio' => ['reps' => '15-20', 'rest' => 45, 'rpe' => 7.0],
            // Esta línea sirve para asignar a salud general (por defecto) 10-12 repeticiones, 75 s y RPE 7,5.
            default => ['reps' => '10-12', 'rest' => 75, 'rpe' => 7.5], // health / fitness general
        };
    }

    /**
     * Cuántos ejercicios entran en el tiempo disponible, asumiendo
     * setsPerExercise series de WORK_SECONDS_PER_SET + el descanso propio
     * del objetivo, por ejercicio. Nunca menos de MIN_EXERCISES_PER_DAY (6):
     * con poco tiempo declarado la sesión se alarga un poco, pero el día
     * sigue teniendo el volumen mínimo que pide el producto.
     */
    // Esta línea sirve para declarar el método privado que calcula cuántos ejercicios entran en el tiempo.
    private function maxExercisesForDuration(int $sessionMinutes, int $setsPerExercise, int $restSeconds): int
    {
        // Esta línea sirve para calcular los segundos que toma cada ejercicio (series por trabajo más descanso).
        $secondsPerExercise = $setsPerExercise * (self::WORK_SECONDS_PER_SET + $restSeconds);
        // Esta línea sirve para calcular cuántos ejercicios caben en los minutos disponibles.
        $fits = intdiv($sessionMinutes * 60, $secondsPerExercise);

        // Esta línea sirve para devolver ese número sin bajar del mínimo de 6.
        return max(self::MIN_EXERCISES_PER_DAY, $fits);
    }
}
