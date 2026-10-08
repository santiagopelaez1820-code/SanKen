<?php

// Esta línea sirve para ubicar este trait en el espacio de nombres de traits de acciones de rutina.

namespace App\Application\Routine\Actions\Concerns;

// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;

/**
 * Compartido entre las acciones de rutina manual de entrenador
 * (App\Application\Trainer\Actions) y las de Super Admin
 * (App\Application\Admin\Actions) — ambas arman una Routine desde el mismo
 * shape de payload (days[].exercises[]), solo cambia quién puede invocarlas.
 */
// Esta línea sirve para declarar el trait que crea los días y ejercicios de una rutina.
trait SyncsRoutineDays
{
    /**
     * @param  array<int, array<string, mixed>>  $days
     */
    // Esta línea sirve para declarar el método que recibe la rutina y la lista de días.
    private function syncRoutineDays(Routine $routine, array $days): void
    {
        // Esta línea sirve para recorrer cada día recibido.
        foreach ($days as $day) {
            // Esta línea sirve para crear el día dentro de la rutina.
            $routineDay = $routine->days()->create([
                // Esta línea sirve para guardar el orden del día.
                'day_order' => $day['day_order'],
                // Esta línea sirve para guardar la etiqueta del día.
                'label' => $day['label'],
                // Esta línea sirve para guardar los grupos musculares del día (o ninguno).
                'target_muscle_groups' => $day['target_muscle_groups'] ?? [],
            ]);

            // Esta línea sirve para recorrer cada ejercicio del día.
            foreach ($day['exercises'] as $exercise) {
                // Esta línea sirve para crear el ejercicio dentro del día.
                $routineDay->exercises()->create([
                    // Esta línea sirve para guardar qué ejercicio del catálogo es.
                    'exercise_id' => $exercise['exercise_id'],
                    // Esta línea sirve para guardar la posición del ejercicio.
                    'order' => $exercise['order'],
                    // Esta línea sirve para guardar las series objetivo.
                    'target_sets' => $exercise['target_sets'],
                    // Esta línea sirve para guardar las repeticiones objetivo.
                    'target_reps' => $exercise['target_reps'],
                    // Esta línea sirve para guardar los segundos de descanso.
                    'rest_seconds' => $exercise['rest_seconds'],
                    // Esta línea sirve para guardar el RPE objetivo, o null si no viene.
                    'target_rpe' => $exercise['target_rpe'] ?? null,
                ]);
            }
        }
    }
}
