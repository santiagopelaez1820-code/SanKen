<?php

namespace App\Application\Admin\Actions;

use App\Application\Routine\Actions\Concerns\SyncsRoutineDays;
use App\Models\Routine;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Reemplaza por completo el contenido de una rutina personalizada existente
 * (source=admin). El guard evita que esta acción se use por error sobre una
 * rutina generada por el motor o asignada por un entrenador — la edición
 * solo afecta a ESE usuario, nunca al resto ni al historial ya registrado
 * (routine_days/routine_exercises no tienen FK vivo desde workout_exercises).
 */
class UpdatePersonalRoutineAction
{
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Routine $routine, array $data): Routine
    {
        abort_unless($routine->source === 'admin', 422, 'Solo se pueden editar rutinas personalizadas asignadas por Super Admin.');

        $updated = DB::transaction(function () use ($routine, $data) {
            $startsAt = $routine->starts_at ?? now();

            $routine->update([
                'goal' => $data['goal'],
                'split_type' => $data['split_type'],
                'frequency_days' => $data['frequency_days'],
                'duration_weeks' => $data['duration_weeks'],
                'ends_at' => $startsAt->copy()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            $routine->days()->delete();
            $this->syncRoutineDays($routine, $data['days']);

            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        Cache::forget(CacheKeys::activeRoutine($routine->user_id));

        return $updated;
    }
}
