<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para declarar la acción que duplica una plantilla de rutina existente.
class DuplicateRoutineTemplateAction
{
    // Esta línea sirve para declarar el método que recibe la plantilla original y devuelve la copia.
    public function execute(RoutineTemplate $source): RoutineTemplate
    {
        // Esta línea sirve para cargar los días y ejercicios de la plantilla original si aún no están cargados.
        $source->loadMissing('days.exercises');

        // Esta línea sirve para hacer toda la copia dentro de una transacción y devolver el resultado.
        return DB::transaction(function () use ($source) {
            // Esta línea sirve para crear la plantilla copia en la base de datos.
            $copy = RoutineTemplate::query()->create([
                // Esta línea sirve para poner como nombre el original (o "N días") seguido de "(copia)".
                'name' => trim(($source->name ?: "{$source->frequency_days} días").' (copia)'),
                // Esta línea sirve para copiar el sexo de la plantilla original.
                'sex' => $source->sex,
                // Esta línea sirve para copiar los días por semana.
                'frequency_days' => $source->frequency_days,
                // Esta línea sirve para copiar el nivel.
                'level' => $source->level,
                // Esta línea sirve para copiar el tipo de división.
                'split_type' => $source->split_type,
                // Esta línea sirve para dejar la copia inactiva.
                'is_active' => false,
            ]);

            // Esta línea sirve para recorrer cada día de la plantilla original.
            foreach ($source->days as $day) {
                // Esta línea sirve para crear el día equivalente en la copia.
                $newDay = $copy->days()->create([
                    // Esta línea sirve para copiar el orden del día.
                    'day_order' => $day->day_order,
                    // Esta línea sirve para copiar la etiqueta del día.
                    'label' => $day->label,
                ]);

                // Esta línea sirve para recorrer cada ejercicio del día original.
                foreach ($day->exercises as $exercise) {
                    // Esta línea sirve para crear el ejercicio equivalente en el día copiado.
                    $newDay->exercises()->create([
                        // Esta línea sirve para copiar qué ejercicio del catálogo es.
                        'exercise_id' => $exercise->exercise_id,
                        // Esta línea sirve para copiar la posición del ejercicio.
                        'order' => $exercise->order,
                        // Esta línea sirve para copiar las series por defecto.
                        'default_sets' => $exercise->default_sets,
                        // Esta línea sirve para copiar las repeticiones por defecto.
                        'default_reps' => $exercise->default_reps,
                        // Esta línea sirve para copiar los segundos de descanso.
                        'rest_seconds' => $exercise->rest_seconds,
                        // Esta línea sirve para copiar el RPE por defecto.
                        'default_rpe' => $exercise->default_rpe,
                    ]);
                }
            }

            // Esta línea sirve para devolver la copia con sus días y ejercicios cargados.
            return $copy->load('days.exercises.exercise.primaryMuscle');
        });
    }
}
