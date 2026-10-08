<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar el modelo WorkoutExercise (ejercicio de una sesión).
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSet (serie).
use App\Models\WorkoutSet;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que registra una serie de un ejercicio.
class LogSetAction
{
    /**
     * @param  array{weight_kg: float, reps: int, rpe?: float|null, is_warmup?: bool, completed?: bool}  $data
     */
    // Esta línea sirve para declarar el método que recibe el ejercicio y los datos de la serie.
    public function execute(WorkoutExercise $workoutExercise, array $data): WorkoutSet
    {
        // Esta línea sirve para contar cuántas series lleva registradas el ejercicio.
        $currentCount = $workoutExercise->sets()->count();

        // Esta línea sirve para revisar si el ejercicio ya está cerrado o llegó al total de series.
        if ($workoutExercise->all_sets_completed || $currentCount >= $workoutExercise->target_sets) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que ya completó todas las series del ejercicio.
                'sets' => ["Ya completaste las {$workoutExercise->target_sets} series de este ejercicio."],
            ]);
        }

        // Esta línea sirve para crear la serie dentro del ejercicio.
        $set = $workoutExercise->sets()->create([
            // Esta línea sirve para guardar el número de serie.
            'set_number' => $currentCount + 1,
            // Esta línea sirve para guardar el peso en kilos.
            'weight_kg' => $data['weight_kg'],
            // Esta línea sirve para guardar las repeticiones.
            'reps' => $data['reps'],
            // Esta línea sirve para guardar el RPE, o null si no se envió.
            'rpe' => $data['rpe'] ?? null,
            // Esta línea sirve para guardar si es de calentamiento (no por defecto).
            'is_warmup' => $data['is_warmup'] ?? false,
            // Esta línea sirve para guardar si se completó (sí por defecto).
            'completed' => $data['completed'] ?? true,
        ]);

        // Llegar al total de series planeadas cierra el ejercicio
        // automáticamente — el usuario no vuelve a poder registrar en él
        // dentro de esta sesión, y el frontend usa este flag para avanzar
        // solo al siguiente ejercicio (ver WorkoutSessionPage/session.tsx).
        // Esta línea sirve para revisar si con esta serie se llegó al total planeado.
        if ($currentCount + 1 >= $workoutExercise->target_sets) {
            // Esta línea sirve para marcar el ejercicio como completado.
            $workoutExercise->update(['all_sets_completed' => true]);
        }

        // Esta línea sirve para devolver la serie creada.
        return $set;
    }
}
