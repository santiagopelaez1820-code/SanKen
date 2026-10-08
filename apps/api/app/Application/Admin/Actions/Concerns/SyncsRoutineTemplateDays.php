<?php

// Esta línea sirve para ubicar este trait en el espacio de nombres de traits de acciones de administración.

namespace App\Application\Admin\Actions\Concerns;

// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;

/**
 * Análogo a SyncsRoutineDays (App\Application\Routine\Actions\Concerns) pero
 * para las tablas de plantilla (routine_template_days/_exercises) — mismos
 * pasos, nombres de columna distintos (default_sets/default_reps/default_rpe
 * en vez de target_sets/target_reps/target_rpe).
 */
// Esta línea sirve para declarar el trait que crea los días y ejercicios de una plantilla de rutina.
trait SyncsRoutineTemplateDays
{
    /**
     * @param  array<int, array<string, mixed>>  $days
     */
    // Esta línea sirve para declarar el método que recibe la plantilla y la lista de días a crear.
    private function syncRoutineTemplateDays(RoutineTemplate $template, array $days): void
    {
        // Esta línea sirve para recorrer cada día recibido.
        foreach ($days as $day) {
            // Esta línea sirve para crear el día dentro de la plantilla.
            $templateDay = $template->days()->create([
                // Esta línea sirve para guardar el orden del día dentro de la semana.
                'day_order' => $day['day_order'],
                // Esta línea sirve para guardar el nombre o etiqueta del día.
                'label' => $day['label'],
            ]);

            // Esta línea sirve para recorrer cada ejercicio de ese día.
            foreach ($day['exercises'] as $exercise) {
                // Esta línea sirve para crear el ejercicio dentro del día de la plantilla.
                $templateDay->exercises()->create([
                    // Esta línea sirve para guardar qué ejercicio del catálogo es.
                    'exercise_id' => $exercise['exercise_id'],
                    // Esta línea sirve para guardar la posición del ejercicio dentro del día.
                    'order' => $exercise['order'],
                    // Esta línea sirve para guardar la cantidad de series por defecto.
                    'default_sets' => $exercise['default_sets'],
                    // Esta línea sirve para guardar la cantidad de repeticiones por defecto.
                    'default_reps' => $exercise['default_reps'],
                    // Esta línea sirve para guardar los segundos de descanso entre series.
                    'rest_seconds' => $exercise['rest_seconds'],
                    // Esta línea sirve para guardar el RPE (esfuerzo percibido) por defecto, o null si no viene.
                    'default_rpe' => $exercise['default_rpe'] ?? null,
                ]);
            }
        }
    }
}
