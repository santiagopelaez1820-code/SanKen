<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

// Esta línea sirve para importar el trait que crea los días y ejercicios de una rutina.
use App\Application\Routine\Actions\Concerns\SyncsRoutineDays;
// Esta línea sirve para importar el modelo Routine (rutina de entrenamiento).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase que arma las claves de caché de la app.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar datos guardados en caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para ejecutar todo dentro de una transacción.
use Illuminate\Support\Facades\DB;

/**
 * Asigna una rutina personalizada (source=admin) a UN usuario específico —
 * desactiva cualquier rutina activa que tuviera (general o de otro origen)
 * solo para ese usuario, sin tocar a nadie más. Igual que las rutinas de
 * entrenador, el motor automático nunca la sobrescribe (ver
 * EloquentRoutineRepository::saveGenerated).
 */
// Esta línea sirve para declarar la acción que asigna una rutina personalizada a un usuario.
class AssignPersonalRoutineAction
{
    // Esta línea sirve para incluir el trait SyncsRoutineDays para poder crear los días de la rutina.
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe al admin, al usuario destino y los datos de la rutina.
    public function execute(User $admin, User $targetUser, array $data): Routine
    {
        // Esta línea sirve para abrir una transacción para que todos los cambios se guarden juntos o ninguno.
        $routine = DB::transaction(function () use ($admin, $targetUser, $data) {
            // Esta línea sirve para desactivar cualquier rutina activa que tuviera el usuario.
            $targetUser->routines()->where('is_active', true)->update(['is_active' => false]);

            // Esta línea sirve para crear la nueva rutina en la base de datos con los siguientes campos.
            $routine = Routine::query()->create([
                // Esta línea sirve para guardar el id del usuario dueño de la rutina.
                'user_id' => $targetUser->id,
                // Esta línea sirve para guardar el id del admin que la asignó.
                'created_by_admin_id' => $admin->id,
                // Esta línea sirve para marcar que la rutina fue creada por un administrador.
                'source' => 'admin',
                // Esta línea sirve para guardar el objetivo de la rutina.
                'goal' => $data['goal'],
                // Esta línea sirve para guardar el tipo de división (split) de la rutina.
                'split_type' => $data['split_type'],
                // Esta línea sirve para guardar cuántos días por semana se entrena.
                'frequency_days' => $data['frequency_days'],
                // Esta línea sirve para guardar cuántas semanas dura la rutina.
                'duration_weeks' => $data['duration_weeks'],
                // Esta línea sirve para dejar la nueva rutina como la activa.
                'is_active' => true,
                // Esta línea sirve para guardar la fecha de inicio (hoy).
                'starts_at' => now()->toDateString(),
                // Esta línea sirve para calcular y guardar la fecha de fin según las semanas de duración.
                'ends_at' => now()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            // Esta línea sirve para crear los días y ejercicios de la rutina a partir de los datos recibidos.
            $this->syncRoutineDays($routine, $data['days']);

            // Esta línea sirve para devolver la rutina con sus días, ejercicios y músculo principal cargados.
            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        // Esta línea sirve para borrar de la caché la rutina activa del usuario para que se vea la nueva.
        Cache::forget(CacheKeys::activeRoutine($targetUser->id));

        // Esta línea sirve para devolver la rutina creada.
        return $routine;
    }
}
