<?php

namespace App\Application\Trainer\Actions;

use App\Application\Trainer\Actions\Concerns\SyncsRoutineDays;
use App\Models\Routine;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Reemplaza por completo el contenido (días y ejercicios) de una rutina
 * manual existente. El editor del entrenador siempre envía el plan completo.
 */
class UpdateManualRoutineAction
{
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Routine $routine, array $data): Routine
    {
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
