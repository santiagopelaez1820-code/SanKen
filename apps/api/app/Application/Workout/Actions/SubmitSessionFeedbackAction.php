<?php

namespace App\Application\Workout\Actions;

use App\Domain\Routine\Services\ProgressiveOverloadCalculator;
use App\Domain\Routine\ValueObjects\PerformanceSummary;
use App\Models\RoutineExercise;
use App\Models\WorkoutSession;

/**
 * "¿Pudiste completar el entrenamiento tal como estaba planeado?" — la
 * respuesta dispara la sobrecarga progresiva para cada ejercicio de la
 * sesión, actualizando routine_exercises.suggested_weight_kg para la
 * próxima vez que aparezca ese día en la rutina.
 *
 * Si la sesión no vino de un día de rutina (entrenamiento libre) no hay
 * routine_exercises que actualizar: solo se guarda la respuesta.
 */
class SubmitSessionFeedbackAction
{
    public function __construct(
        private readonly ProgressiveOverloadCalculator $calculator,
    ) {}

    public function execute(WorkoutSession $session, bool $completedAsPlanned): WorkoutSession
    {
        $session->update(['completed_as_planned' => $completedAsPlanned]);

        if ($session->routine_day_id === null) {
            return $session->fresh(['exercises.exercise', 'exercises.sets']);
        }

        $routineExercises = RoutineExercise::query()
            ->where('routine_day_id', $session->routine_day_id)
            ->with('exercise')
            ->get()
            ->keyBy('exercise_id');

        foreach ($session->exercises()->with('sets')->get() as $workoutExercise) {
            /** @var RoutineExercise|null $routineExercise */
            $routineExercise = $routineExercises->get($workoutExercise->exercise_id);

            // Ejercicio libre agregado durante la sesión: no forma parte del
            // plan, no hay nada que recalcular.
            if (! $routineExercise) {
                continue;
            }

            $workingSets = $workoutExercise->sets->where('is_warmup', false)->where('completed', true);

            if ($workingSets->isEmpty()) {
                continue;
            }

            $performance = new PerformanceSummary(
                targetSets: $routineExercise->target_sets,
                targetRepsMin: $this->parseMinReps($routineExercise->target_reps),
                actualSets: $workingSets->count(),
                averageReps: (float) $workingSets->avg('reps'),
                topWeightUsed: (float) $workingSets->max('weight_kg'),
                completedAsPlanned: $completedAsPlanned,
            );

            $suggestion = $this->calculator->calculate(
                $performance,
                $routineExercise->exercise->equipment,
                $routineExercise->consecutive_failures,
            );

            $routineExercise->update([
                'suggested_weight_kg' => $suggestion->suggestedWeightKg,
                'consecutive_failures' => $suggestion->consecutiveFailures,
            ]);
        }

        return $session->fresh(['exercises.exercise', 'exercises.sets']);
    }

    private function parseMinReps(string $targetReps): int
    {
        return (int) explode('-', $targetReps)[0];
    }
}
