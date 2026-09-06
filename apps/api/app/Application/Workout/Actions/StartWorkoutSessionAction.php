<?php

namespace App\Application\Workout\Actions;

use App\Domain\Workout\Services\SessionReadinessAdjuster;
use App\Domain\Workout\ValueObjects\SessionAdjustment;
use App\Models\RoutineDay;
use App\Models\User;
use App\Models\WorkoutSession;

class StartWorkoutSessionAction
{
    public function __construct(
        private readonly SessionReadinessAdjuster $readinessAdjuster,
    ) {}

    /**
     * @param  array{sleep_quality?: int, energy_level?: int, muscle_soreness?: int}  $precheck
     */
    public function execute(User $user, ?RoutineDay $routineDay, array $precheck): WorkoutSession
    {
        $user->loadMissing('onboardingResponse');
        $adjustment = $this->readinessAdjuster->adjustmentFor($precheck, $user->onboardingResponse?->level ?? 'intermediate');

        $session = $user->workoutSessions()->create([
            'routine_day_id' => $routineDay?->id,
            'performed_at' => now()->toDateString(),
            'sleep_quality' => $precheck['sleep_quality'] ?? null,
            'energy_level' => $precheck['energy_level'] ?? null,
            'muscle_soreness' => $precheck['muscle_soreness'] ?? null,
            'completed' => false,
            'readiness_adjusted' => ! $adjustment->isNeutral(),
            'readiness_note' => $adjustment->note,
        ]);

        // Precarga los ejercicios planeados para que el usuario no tenga que
        // volver a armarlos manualmente; puede agregar más sobre la marcha.
        //
        // Copia (snapshot) target_sets/target_reps/suggested_weight_kg del
        // routine_exercise al iniciar — antes la pantalla de entrenamiento
        // dependía de una consulta aparte a /routines/active cruzada por
        // índice de array, lo que rompía tanto el peso recomendado (llegaba
        // desactualizado) como la posibilidad de recargar la página a mitad
        // de sesión. Con esto la sesión es autosuficiente.
        //
        // El recorte de SessionReadinessAdjuster se aplica acá, sobre la
        // copia — routine_exercise (la plantilla de la rutina) nunca se
        // modifica, así que la próxima sesión vuelve a partir de los valores
        // completos.
        if ($routineDay) {
            foreach ($routineDay->exercises as $routineExercise) {
                $targetSets = $this->readinessAdjuster->applySets($routineExercise->target_sets, $adjustment);

                $session->exercises()->create([
                    'exercise_id' => $routineExercise->exercise_id,
                    'order' => $routineExercise->order,
                    'all_sets_completed' => false,
                    'target_sets' => $targetSets,
                    'target_reps' => $routineExercise->target_reps,
                    'rest_seconds' => $routineExercise->rest_seconds,
                    'target_rpe' => $this->readinessAdjuster->applyRpe($routineExercise->target_rpe, $adjustment),
                    'suggested_weight_kg' => $this->readinessAdjuster->applyWeight($routineExercise->suggested_weight_kg, $adjustment),
                    'suggested_reps_per_set' => $this->readinessAdjuster->applyRepsPerSet($routineExercise->suggested_reps_per_set, $targetSets),
                ]);
            }
        }

        return $session->load('exercises.exercise', 'routineDay');
    }
}
