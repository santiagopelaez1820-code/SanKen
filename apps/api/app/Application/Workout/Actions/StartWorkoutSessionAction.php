<?php

namespace App\Application\Workout\Actions;

use App\Models\RoutineDay;
use App\Models\User;
use App\Models\WorkoutSession;

class StartWorkoutSessionAction
{
    /**
     * @param  array{sleep_quality?: int, energy_level?: int, muscle_soreness?: int}  $precheck
     */
    public function execute(User $user, ?RoutineDay $routineDay, array $precheck): WorkoutSession
    {
        $session = $user->workoutSessions()->create([
            'routine_day_id' => $routineDay?->id,
            'performed_at' => now()->toDateString(),
            'sleep_quality' => $precheck['sleep_quality'] ?? null,
            'energy_level' => $precheck['energy_level'] ?? null,
            'muscle_soreness' => $precheck['muscle_soreness'] ?? null,
            'completed' => false,
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
        if ($routineDay) {
            foreach ($routineDay->exercises as $routineExercise) {
                $session->exercises()->create([
                    'exercise_id' => $routineExercise->exercise_id,
                    'order' => $routineExercise->order,
                    'all_sets_completed' => false,
                    'target_sets' => $routineExercise->target_sets,
                    'target_reps' => $routineExercise->target_reps,
                    'rest_seconds' => $routineExercise->rest_seconds,
                    'target_rpe' => $routineExercise->target_rpe,
                    'suggested_weight_kg' => $routineExercise->suggested_weight_kg,
                    'suggested_reps_per_set' => $routineExercise->suggested_reps_per_set,
                ]);
            }
        }

        return $session->load('exercises.exercise', 'routineDay');
    }
}
