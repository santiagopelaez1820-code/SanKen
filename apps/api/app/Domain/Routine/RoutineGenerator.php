<?php

namespace App\Domain\Routine;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
use App\Domain\Routine\Services\ExerciseSelector;
use App\Domain\Routine\Services\SetRepRestAssigner;
use App\Domain\Routine\Services\SplitSelector;
use App\Domain\Routine\Strategies\RoutineStrategyFactory;
use App\Domain\Routine\ValueObjects\GeneratedDay;
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
use App\Domain\Routine\ValueObjects\OnboardingProfile;

/**
 * Orquesta el pipeline completo del motor de rutinas (ver docs/01-arquitectura.md §6):
 * perfil -> estrategia por objetivo -> split -> selección de ejercicios -> series/reps/descanso.
 * Pura lógica de dominio: no toca Eloquent ni la base de datos.
 */
final class RoutineGenerator implements RoutineGeneratorInterface
{
    private const DURATION_WEEKS = 6;

    /**
     * @param  array<string, array{target_reps: string, sets: int, rir: float, rest_seconds: int}>  $goalParametersConfig
     * @param  array<string, int>  $exercisesPerMuscleByLevel
     * @param  array<int, int>  $maxExercisesBySessionMinutes
     */
    public function __construct(
        private readonly SplitSelector $splitSelector,
        private readonly ExerciseSelector $exerciseSelector,
        private readonly SetRepRestAssigner $assigner,
        private readonly array $goalParametersConfig,
        private readonly array $exercisesPerMuscleByLevel,
        private readonly array $maxExercisesBySessionMinutes,
    ) {}

    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine
    {
        $goal = $profile->primaryGoal();
        $strategy = RoutineStrategyFactory::make($goal, $this->goalParametersConfig);
        $split = $this->splitSelector->selectFor($profile->frequencyDays);

        $perMuscle = $this->exercisesPerMuscleByLevel[$profile->level] ?? 1;
        $maxTotal = $this->maxExercisesBySessionMinutes[$profile->sessionMinutes] ?? 5;

        $days = [];
        $usedAcrossRoutine = [];

        foreach ($split->days as $index => $dayDefinition) {
            $selectedIds = $this->exerciseSelector->select(
                pool: $exercisePool,
                targetMuscles: $dayDefinition->muscles,
                level: $profile->level,
                equipmentAvailable: $profile->equipmentAvailable,
                injuries: $profile->injuries,
                perMuscle: $perMuscle,
                maxTotal: $maxTotal,
                compoundRatio: $strategy->preferredCompoundRatio(),
                excludeIds: $usedAcrossRoutine,
            );

            $usedAcrossRoutine = [...$usedAcrossRoutine, ...$selectedIds];

            $days[] = new GeneratedDay(
                order: $index + 1,
                label: $dayDefinition->label,
                targetMuscleGroups: $dayDefinition->muscles,
                exercises: $this->assigner->assign($selectedIds, $strategy->goalParameters()),
            );
        }

        return new GeneratedRoutine(
            goal: $goal,
            splitType: $split->type,
            frequencyDays: $profile->frequencyDays,
            durationWeeks: self::DURATION_WEEKS,
            days: $days,
        );
    }
}
