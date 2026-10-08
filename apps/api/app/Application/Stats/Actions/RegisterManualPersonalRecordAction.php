<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de estadísticas.

namespace App\Application\Stats\Actions;

// Esta línea sirve para importar el modelo PersonalRecord (récord personal).
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;

/**
 * Registro voluntario de un PR (pestaña "PR", totalmente aparte del flujo de
 * entrenamiento) — replica el mismo guard "el mejor gana, nunca baja" de
 * DetectPersonalRecordAction (PersonalRecord::isBeatenBy), pero sin crear ni
 * tocar WorkoutSession, WorkoutExercise ni WorkoutSet: workout_set_id queda null.
 */
// Esta línea sirve para declarar la acción que registra un récord personal manual.
class RegisterManualPersonalRecordAction
{
    // Esta línea sirve para declarar el método que recibe usuario, ejercicio, peso y repeticiones.
    public function execute(User $user, int $exerciseId, float $weightKg, int $reps): ?PersonalRecord
    {
        // Esta línea sirve para buscar el récord actual del usuario.
        $existing = PersonalRecord::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar por el ejercicio.
            ->where('exercise_id', $exerciseId)
            // Esta línea sirve para filtrar por el tipo de récord 1RM.
            ->where('record_type', '1rm')
            // Esta línea sirve para obtener el primero.
            ->first();

        // Esta línea sirve para revisar si ya hay un récord y el nuevo no lo supera.
        if ($existing && ! $existing->isBeatenBy($weightKg, $reps)) {
            // Esta línea sirve para devolver null porque no es un récord nuevo.
            return null;
        }

        // Esta línea sirve para crear o actualizar el récord.
        $record = PersonalRecord::query()->updateOrCreate(
            // Esta línea sirve para buscar por usuario, ejercicio y tipo 1RM.
            ['user_id' => $user->id, 'exercise_id' => $exerciseId, 'record_type' => '1rm'],
            // Esta línea sirve para guardar el peso, las repeticiones, la fecha de hoy y sin serie asociada.
            ['value' => round($weightKg, 2), 'reps' => $reps, 'achieved_at' => now()->toDateString(), 'workout_set_id' => null],
        );

        // Esta línea sirve para borrar la caché del dashboard del usuario.
        Cache::forget(CacheKeys::statsDashboard($user->id));

        // Esta línea sirve para devolver el récord guardado.
        return $record;
    }
}
