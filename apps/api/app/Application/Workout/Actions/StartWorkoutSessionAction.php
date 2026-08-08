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
        if ($routineDay) {
            foreach ($routineDay->exercises as $routineExercise) {
                $session->exercises()->create([
                    'exercise_id' => $routineExercise->exercise_id,
                    'order' => $routineExercise->order,
                    'all_sets_completed' => false,
                ]);
            }
        }

        return $session->load('exercises.exercise', 'routineDay');
    }
}
