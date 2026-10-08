<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones del entrenador.

namespace App\Application\Trainer\Actions;

// Esta línea sirve para importar el trait que crea los días y ejercicios de una rutina.
use App\Application\Routine\Actions\Concerns\SyncsRoutineDays;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * Reemplaza por completo el contenido (días y ejercicios) de una rutina
 * manual existente. El editor del entrenador siempre envía el plan completo.
 */
// Esta línea sirve para declarar la acción que edita una rutina manual.
class UpdateManualRoutineAction
{
    // Esta línea sirve para incluir el trait que crea los días de la rutina.
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe la rutina y los datos nuevos.
    public function execute(Routine $routine, array $data): Routine
    {
        // Esta línea sirve para hacer la edición dentro de una transacción.
        $updated = DB::transaction(function () use ($routine, $data) {
            // Esta línea sirve para tomar la fecha de inicio de la rutina, o hoy si no tiene.
            $startsAt = $routine->starts_at ?? now();

            // Esta línea sirve para actualizar los datos generales de la rutina.
            $routine->update([
                // Esta línea sirve para actualizar el objetivo.
                'goal' => $data['goal'],
                // Esta línea sirve para actualizar el tipo de división.
                'split_type' => $data['split_type'],
                // Esta línea sirve para actualizar los días por semana.
                'frequency_days' => $data['frequency_days'],
                // Esta línea sirve para actualizar la duración en semanas.
                'duration_weeks' => $data['duration_weeks'],
                // Esta línea sirve para recalcular la fecha de fin.
                'ends_at' => $startsAt->copy()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            // Esta línea sirve para borrar los días actuales de la rutina.
            $routine->days()->delete();
            // Esta línea sirve para crear los días y ejercicios nuevos.
            $this->syncRoutineDays($routine, $data['days']);

            // Esta línea sirve para devolver la rutina con sus días y ejercicios cargados.
            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        // Esta línea sirve para borrar de la caché la rutina activa del dueño.
        Cache::forget(CacheKeys::activeRoutine($routine->user_id));

        // Esta línea sirve para devolver la rutina actualizada.
        return $updated;
    }
}
