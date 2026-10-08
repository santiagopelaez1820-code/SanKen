<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los repositorios Eloquent.

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

// Esta línea sirve para importar el contrato del repositorio de rutinas.
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
// Esta línea sirve para importar el objeto con la rutina generada por el motor.
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para manejar la caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para declarar el repositorio de rutinas que usa Eloquent.
class EloquentRoutineRepository implements RoutineRepositoryInterface
{
    // Esta línea sirve para declarar el método que busca la rutina activa de un usuario.
    public function findActiveForUser(User $user): ?Routine
    {
        // Esta línea sirve para consultar las rutinas.
        return Routine::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar solo la activa.
            ->where('is_active', true)
            // Esta línea sirve para obtener la primera.
            ->first();
    }

    // Esta línea sirve para declarar el método que guarda una rutina generada por el motor.
    public function saveGenerated(User $user, GeneratedRoutine $generated): Routine
    {
        // Esta línea sirve para ejecutar todo dentro de una transacción.
        $routine = DB::transaction(function () use ($user, $generated) {
            // Esta línea sirve para buscar la rutina activa actual.
            $existingActive = $this->findActiveForUser($user);

            // El motor nunca sobrescribe una rutina asignada manualmente por un entrenador o por Super Admin.
            // Esta línea sirve para revisar si la rutina activa la asignó un entrenador o un admin.
            if ($existingActive && in_array($existingActive->source, ['trainer', 'admin'], true)) {
                // Esta línea sirve para devolverla sin reemplazarla.
                return $existingActive;
            }

            // Esta línea sirve para desactivar la rutina activa anterior si existe.
            $existingActive?->update(['is_active' => false]);

            // Esta línea sirve para crear la rutina nueva.
            $routine = Routine::query()->create([
                // Esta línea sirve para guardar el id del usuario.
                'user_id' => $user->id,
                // Esta línea sirve para marcar que la generó el motor.
                'source' => 'engine',
                // Esta línea sirve para guardar el objetivo.
                'goal' => $generated->goal,
                // Esta línea sirve para guardar el tipo de división.
                'split_type' => $generated->splitType,
                // Esta línea sirve para guardar la frecuencia semanal.
                'frequency_days' => $generated->frequencyDays,
                // Esta línea sirve para guardar la duración en semanas.
                'duration_weeks' => $generated->durationWeeks,
                // Esta línea sirve para marcarla como activa.
                'is_active' => true,
                // Esta línea sirve para guardar la fecha de inicio (hoy).
                'starts_at' => now()->toDateString(),
                // Esta línea sirve para guardar la fecha de fin según la duración.
                'ends_at' => now()->addWeeks($generated->durationWeeks)->toDateString(),
            ]);

            // Esta línea sirve para recorrer los días generados.
            foreach ($generated->days as $day) {
                // Esta línea sirve para crear el día dentro de la rutina.
                $routineDay = $routine->days()->create([
                    // Esta línea sirve para guardar el orden del día.
                    'day_order' => $day->order,
                    // Esta línea sirve para guardar el nombre del día.
                    'label' => $day->label,
                    // Esta línea sirve para guardar los grupos musculares del día.
                    'target_muscle_groups' => $day->targetMuscleGroups,
                ]);

                // Esta línea sirve para recorrer los ejercicios del día.
                foreach ($day->exercises as $exercise) {
                    // Esta línea sirve para crear el ejercicio dentro del día.
                    $routineDay->exercises()->create([
                        // Esta línea sirve para guardar el ejercicio.
                        'exercise_id' => $exercise->exerciseId,
                        // Esta línea sirve para guardar el orden.
                        'order' => $exercise->order,
                        // Esta línea sirve para guardar las series objetivo.
                        'target_sets' => $exercise->targetSets,
                        // Esta línea sirve para guardar las repeticiones objetivo.
                        'target_reps' => $exercise->targetReps,
                        // Esta línea sirve para guardar el descanso en segundos.
                        'rest_seconds' => $exercise->restSeconds,
                        // Esta línea sirve para guardar el RPE objetivo.
                        'target_rpe' => $exercise->targetRpe,
                        // Esta línea sirve para dejar el peso sugerido vacío.
                        'suggested_weight_kg' => null,
                    ]);
                }
            }

            // Esta línea sirve para devolver la rutina con sus días y ejercicios.
            return $routine->load('days.exercises.exercise');
        });

        // Esta línea sirve para borrar la rutina activa de la caché.
        Cache::forget(CacheKeys::activeRoutine($user->id));

        // Esta línea sirve para devolver la rutina.
        return $routine;
    }
}
