<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

// Esta línea sirve para importar el trait que crea los días y ejercicios de una plantilla.
use App\Application\Admin\Actions\Concerns\SyncsRoutineTemplateDays;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * Reemplazo completo de días/ejercicios (delete + recrea), igual que
 * UpdateManualRoutineAction — no toca `is_active` (eso solo lo cambian
 * activate()/deactivate() en el controller, para no romper la garantía de
 * "una sola plantilla activa por sexo+frecuencia").
 *
 * Esto edita SOLO la plantilla — nunca las Routine/RoutineDay/RoutineExercise
 * ya generadas para usuarios reales (tablas completamente separadas, sin FK
 * entre sí), así que el historial de nadie se ve afectado.
 */
// Esta línea sirve para declarar la acción que edita una plantilla de rutina.
class UpdateRoutineTemplateAction
{
    // Esta línea sirve para incluir el trait que crea los días de la plantilla.
    use SyncsRoutineTemplateDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe la plantilla y los datos nuevos.
    public function execute(RoutineTemplate $template, array $data): RoutineTemplate
    {
        // Esta línea sirve para hacer la edición dentro de una transacción y devolver el resultado.
        return DB::transaction(function () use ($template, $data) {
            // Esta línea sirve para actualizar solo los campos permitidos (nombre, sexo, frecuencia, nivel y división).
            $template->update(array_intersect_key($data, array_flip(['name', 'sex', 'frequency_days', 'level', 'split_type'])));

            // Esta línea sirve para revisar si en los datos vienen días nuevos.
            if (array_key_exists('days', $data)) {
                // Esta línea sirve para borrar los días actuales de la plantilla.
                $template->days()->delete();
                // Esta línea sirve para crear los días y ejercicios nuevos.
                $this->syncRoutineTemplateDays($template, $data['days']);
            }

            // Esta línea sirve para devolver la plantilla con sus días y ejercicios cargados.
            return $template->load('days.exercises.exercise.primaryMuscle');
        });
    }
}
