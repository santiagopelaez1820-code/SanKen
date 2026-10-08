<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar el modelo WorkoutExercise (ejercicio de una sesión).
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;

// Esta línea sirve para declarar la acción que agrega un ejercicio a una sesión.
class AddExerciseToSessionAction
{
    // Esta línea sirve para declarar el método que recibe la sesión y el id del ejercicio.
    public function execute(WorkoutSession $session, int $exerciseId): WorkoutExercise
    {
        // Esta línea sirve para calcular la posición siguiente a la del último ejercicio.
        $nextOrder = $session->exercises()->max('order') + 1;

        // Esta línea sirve para crear el ejercicio dentro de la sesión.
        return $session->exercises()->create([
            // Esta línea sirve para guardar qué ejercicio del catálogo es.
            'exercise_id' => $exerciseId,
            // Esta línea sirve para guardar su posición.
            'order' => $nextOrder,
            // Esta línea sirve para indicar que aún no completó sus series.
            'all_sets_completed' => false,
            // Esta línea sirve para asignar 3 series objetivo.
            'target_sets' => 3,
            // Esta línea sirve para devolver el ejercicio con sus datos del catálogo cargados.
        ])->load('exercise');
    }
}
