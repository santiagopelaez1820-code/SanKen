<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las estrategias de rutina.

namespace App\Domain\Routine\Strategies;

// Esta línea sirve para importar el contrato de las estrategias de rutina.
use App\Domain\Routine\Contracts\RoutineStrategyInterface;
// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;
// Esta línea sirve para importar la excepción para objetivos sin configuración.
use InvalidArgumentException;

// Esta línea sirve para declarar la fábrica que crea la estrategia según el objetivo.
final class RoutineStrategyFactory
{
    // Esta línea sirve para definir qué estrategia corresponde a cada objetivo.
    private const GOAL_TO_STRATEGY = [
        // Esta línea sirve para ganar músculo usa la estrategia de hipertrofia.
        'gain_muscle' => HypertrophyStrategy::class,
        // Esta línea sirve para asignar a recomposición corporal la estrategia de hipertrofia.
        'body_recomposition' => HypertrophyStrategy::class,
        // Esta línea sirve para asignar a fuerza la estrategia de fuerza.
        'strength' => StrengthStrategy::class,
        // Esta línea sirve para asignar a rendimiento deportivo la estrategia de fuerza.
        'sport_performance' => StrengthStrategy::class,
        // Esta línea sirve para perder grasa usa la estrategia de pérdida de grasa.
        'lose_fat' => FatLossStrategy::class,
        // Esta línea sirve para asignar a resistencia la estrategia de resistencia.
        'endurance' => EnduranceStrategy::class,
        // Esta línea sirve para asignar a salud la estrategia de resistencia.
        'health' => EnduranceStrategy::class,
        // Esta línea sirve para asignar a cardio la estrategia de resistencia.
        'cardio' => EnduranceStrategy::class,
    ];

    /**
     * @param  array<string, array{target_reps: string, sets: int, rir: float, rest_seconds: int}>  $goalParametersConfig
     *                                                                                                                     Config completo de routine_engine.goal_parameters (todas las metas).
     */
    // Esta línea sirve para declarar el método que crea la estrategia de un objetivo.
    public static function make(string $goal, array $goalParametersConfig): RoutineStrategyInterface
    {
        // Esta línea sirve para elegir la clase de estrategia (hipertrofia por defecto).
        $strategyClass = self::GOAL_TO_STRATEGY[$goal] ?? HypertrophyStrategy::class;

        // Esta línea sirve para obtener los parámetros configurados del objetivo.
        $row = $goalParametersConfig[$goal]
            // Esta línea sirve para lanzar un error si el objetivo no está configurado.
            ?? throw new InvalidArgumentException("No hay parámetros configurados para el objetivo [{$goal}].");

        // Esta línea sirve para crear los parámetros del objetivo.
        $parameters = new GoalParameters(
            // Esta línea sirve para pasar el rango de repeticiones.
            targetReps: $row['target_reps'],
            // Esta línea sirve para pasar las series.
            sets: $row['sets'],
            // Esta línea sirve para pasar las repeticiones en reserva.
            rir: $row['rir'],
            // Esta línea sirve para pasar los segundos de descanso.
            restSeconds: $row['rest_seconds'],
        );

        // Esta línea sirve para crear y devolver la estrategia con sus parámetros.
        return new $strategyClass($parameters);
    }
}
