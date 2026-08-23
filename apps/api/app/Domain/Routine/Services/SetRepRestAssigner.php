<?php

namespace App\Domain\Routine\Services;

use App\Domain\Routine\ValueObjects\GeneratedExercise;
use App\Domain\Routine\ValueObjects\GoalParameters;

final class SetRepRestAssigner
{
    /**
     * @param  int[]  $exerciseIds  en orden de ejecución
     * @return GeneratedExercise[]
     */
    public function assign(array $exerciseIds, GoalParameters $parameters): array
    {
        return array_values(array_map(
            fn (int $exerciseId, int $index) => new GeneratedExercise(
                exerciseId: $exerciseId,
                order: $index + 1,
                targetSets: $parameters->sets,
                targetReps: $parameters->targetReps,
                restSeconds: $parameters->restSeconds,
                targetRpe: round(10 - $parameters->rir, 1),
            ),
            $exerciseIds,
            array_keys($exerciseIds),
        ));
    }
}
