<?php

namespace App\Application\Workout\Actions;

use App\Models\WorkoutExercise;
use App\Models\WorkoutSet;
use Illuminate\Validation\ValidationException;

class LogSetAction
{
    /**
     * @param  array{weight_kg: float, reps: int, rpe?: float|null, is_warmup?: bool, completed?: bool}  $data
     */
    public function execute(WorkoutExercise $workoutExercise, array $data): WorkoutSet
    {
        $currentCount = $workoutExercise->sets()->count();

        if ($workoutExercise->all_sets_completed || $currentCount >= $workoutExercise->target_sets) {
            throw ValidationException::withMessages([
                'sets' => ["Ya completaste las {$workoutExercise->target_sets} series de este ejercicio."],
            ]);
        }

        $set = $workoutExercise->sets()->create([
            'set_number' => $currentCount + 1,
            'weight_kg' => $data['weight_kg'],
            'reps' => $data['reps'],
            'rpe' => $data['rpe'] ?? null,
            'is_warmup' => $data['is_warmup'] ?? false,
            'completed' => $data['completed'] ?? true,
        ]);

        // Llegar al total de series planeadas cierra el ejercicio
        // automáticamente — el usuario no vuelve a poder registrar en él
        // dentro de esta sesión, y el frontend usa este flag para avanzar
        // solo al siguiente ejercicio (ver WorkoutSessionPage/session.tsx).
        if ($currentCount + 1 >= $workoutExercise->target_sets) {
            $workoutExercise->update(['all_sets_completed' => true]);
        }

        return $set;
    }
}
