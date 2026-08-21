<?php

namespace App\Application\Workout\Actions;

use App\Domain\Routine\Services\ProgressiveOverloadCalculator;
use App\Domain\Routine\ValueObjects\PerformanceSummary;
use App\Models\RoutineExercise;
use App\Models\WorkoutSession;
use Illuminate\Support\Facades\DB;

/**
 * "¿Pudiste completar el entrenamiento tal como estaba planeado?" — la
 * respuesta dispara la sobrecarga progresiva para cada ejercicio de la
 * sesión, actualizando routine_exercises.suggested_weight_kg/
 * suggested_reps_per_set para la próxima vez que aparezca ese día en la
 * rutina.
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
        // Todo en una transacción: recorre y actualiza suggested_weight_kg/
        // suggested_reps_per_set/consecutive_failures de VARIOS
        // routine_exercises -- sin esto, una falla a mitad del loop dejaría
        // algunos ejercicios con la sugerencia de la próxima sesión ya
        // recalculada y otros con el valor viejo, un estado de sobrecarga
        // progresiva inconsistente y silencioso.
        return DB::transaction(function () use ($session, $completedAsPlanned) {
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

                // Orden real de ejecución (set_number), solo series de trabajo —
                // el índice posicional (0, 1, 2...) es "serie 1, serie 2..." a
                // los efectos de la rampa, no el set_number crudo.
                $workingSets = $workoutExercise->sets
                    ->where('is_warmup', false)
                    ->where('completed', true)
                    ->values();

                if ($workingSets->isEmpty()) {
                    continue;
                }

                $performance = new PerformanceSummary(
                    targetSets: $routineExercise->target_sets,
                    actualRepsPerSet: $workingSets->pluck('reps')->all(),
                    actualWeightPerSet: $workingSets->pluck('weight_kg')->map(fn ($w) => (float) $w)->all(),
                    targetRepsPerSet: $routineExercise->suggested_reps_per_set,
                    completedAsPlanned: $completedAsPlanned,
                );

                $suggestion = $this->calculator->calculate(
                    $performance,
                    $routineExercise->exercise->equipment,
                    $routineExercise->consecutive_failures,
                    $this->parseMinReps($routineExercise->target_reps),
                );

                $routineExercise->update([
                    'suggested_weight_kg' => $suggestion->suggestedWeightKg,
                    'suggested_reps_per_set' => $suggestion->suggestedRepsPerSet,
                    'consecutive_failures' => $suggestion->consecutiveFailures,
                ]);
            }

            return $session->fresh(['exercises.exercise', 'exercises.sets']);
        });
    }

    private function parseMinReps(string $targetReps): int
    {
        return (int) explode('-', $targetReps)[0];
    }
}
