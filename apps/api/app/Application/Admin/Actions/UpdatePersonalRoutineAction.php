<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

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
 * Reemplaza por completo el contenido de una rutina personalizada existente
 * (source=admin). El guard evita que esta acción se use por error sobre una
 * rutina generada por el motor o asignada por un entrenador — la edición
 * solo afecta a ESE usuario, nunca al resto ni al historial ya registrado
 * (routine_days/routine_exercises no tienen FK vivo desde workout_exercises).
 */
// Esta línea sirve para declarar la acción que edita una rutina personalizada.
class UpdatePersonalRoutineAction
{
    // Esta línea sirve para incluir el trait que crea los días de la rutina.
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe la rutina y los datos nuevos.
    public function execute(Routine $routine, array $data): Routine
    {
        // Esta línea sirve para impedir (error 422) editar rutinas que no fueron asignadas por un admin.
        abort_unless($routine->source === 'admin', 422, 'Solo se pueden editar rutinas personalizadas asignadas por Super Admin.');

        // Esta línea sirve para hacer la edición dentro de una transacción y guardar el resultado.
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
                // Esta línea sirve para recalcular la fecha de fin desde la fecha de inicio.
                'ends_at' => $startsAt->copy()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            // Esta línea sirve para borrar todos los días actuales de la rutina.
            $routine->days()->delete();
            // Esta línea sirve para volver a crear los días y ejercicios con los datos nuevos.
            $this->syncRoutineDays($routine, $data['days']);

            // Esta línea sirve para devolver la rutina con sus días y ejercicios cargados.
            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        // Esta línea sirve para borrar de la caché la rutina activa del dueño de la rutina.
        Cache::forget(CacheKeys::activeRoutine($routine->user_id));

        // Esta línea sirve para devolver la rutina actualizada.
        return $updated;
    }
}
