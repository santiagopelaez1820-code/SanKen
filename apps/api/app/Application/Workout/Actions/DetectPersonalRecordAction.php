<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de entrenamiento.

namespace App\Application\Workout\Actions;

// Esta línea sirve para importar el evento que avisa que se rompió un récord.
use App\Events\PRBroken;
// Esta línea sirve para importar el modelo PersonalRecord (récord personal).
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSet (serie).
use App\Models\WorkoutSet;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;

/**
 * Actualiza el récord del ejercicio si la serie recién registrada lo supera
 * (más peso, o mismo peso con más reps — ver PersonalRecord::isBeatenBy).
 * Series de calentamiento o no completadas nunca cuentan como récord.
 */
// Esta línea sirve para declarar la acción que detecta si una serie es un récord personal.
class DetectPersonalRecordAction
{
    // Esta línea sirve para declarar el método que recibe al usuario, la serie y el ejercicio.
    public function execute(User $user, WorkoutSet $set, int $exerciseId): ?PersonalRecord
    {
        // Esta línea sirve para revisar si es calentamiento, no está completada o no tiene peso.
        if ($set->is_warmup || ! $set->completed || (float) $set->weight_kg <= 0) {
            // Esta línea sirve para devolver null porque no puede ser récord.
            return null;
        }

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

        // Esta línea sirve para revisar si ya hay un récord y la serie no lo supera.
        if ($existing && ! $existing->isBeatenBy((float) $set->weight_kg, (int) $set->reps)) {
            // Esta línea sirve para devolver null porque no es récord.
            return null;
        }

        // Esta línea sirve para crear o actualizar el récord.
        $record = PersonalRecord::query()->updateOrCreate(
            // Esta línea sirve para buscar por usuario, ejercicio y tipo 1RM.
            ['user_id' => $user->id, 'exercise_id' => $exerciseId, 'record_type' => '1rm'],
            // Esta línea sirve para guardar peso, repeticiones, fecha de hoy y la serie que lo logró.
            ['value' => $set->weight_kg, 'reps' => $set->reps, 'achieved_at' => now()->toDateString(), 'workout_set_id' => $set->id],
        );

        // Esta línea sirve para borrar la caché del dashboard del usuario.
        Cache::forget(CacheKeys::statsDashboard($user->id));

        // Esta línea sirve para disparar el evento de récord roto (otorga XP).
        PRBroken::dispatch($user);

        // Esta línea sirve para devolver el récord nuevo.
        return $record;
    }
}
