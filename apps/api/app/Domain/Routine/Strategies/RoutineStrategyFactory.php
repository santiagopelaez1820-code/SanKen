<?php

namespace App\Domain\Routine\Strategies;

use App\Domain\Routine\Contracts\RoutineStrategyInterface;
use App\Domain\Routine\ValueObjects\GoalParameters;
use InvalidArgumentException;

final class RoutineStrategyFactory
{
    private const GOAL_TO_STRATEGY = [
        'gain_muscle' => HypertrophyStrategy::class,
        'body_recomposition' => HypertrophyStrategy::class,
        'strength' => StrengthStrategy::class,
        'sport_performance' => StrengthStrategy::class,
        'lose_fat' => FatLossStrategy::class,
        'endurance' => EnduranceStrategy::class,
        'health' => EnduranceStrategy::class,
        'cardio' => EnduranceStrategy::class,
    ];

    /**
     * @param  array<string, array{target_reps: string, sets: int, rir: float, rest_seconds: int}>  $goalParametersConfig
     *                                                                                                                     Config completo de routine_engine.goal_parameters (todas las metas).
     */
    public static function make(string $goal, array $goalParametersConfig): RoutineStrategyInterface
    {
        $strategyClass = self::GOAL_TO_STRATEGY[$goal] ?? HypertrophyStrategy::class;

        $row = $goalParametersConfig[$goal]
            ?? throw new InvalidArgumentException("No hay parámetros configurados para el objetivo [{$goal}].");

        $parameters = new GoalParameters(
            targetReps: $row['target_reps'],
            sets: $row['sets'],
            rir: $row['rir'],
            restSeconds: $row['rest_seconds'],
        );

        return new $strategyClass($parameters);
    }
}
