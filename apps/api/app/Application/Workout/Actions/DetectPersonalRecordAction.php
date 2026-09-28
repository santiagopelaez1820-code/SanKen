<?php

namespace App\Application\Workout\Actions;

use App\Events\PRBroken;
use App\Models\PersonalRecord;
use App\Models\User;
use App\Models\WorkoutSet;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

/**
 * Actualiza el récord del ejercicio si la serie recién registrada lo supera
 * (más peso, o mismo peso con más reps — ver PersonalRecord::isBeatenBy).
 * Series de calentamiento o no completadas nunca cuentan como récord.
 */
class DetectPersonalRecordAction
{
    public function execute(User $user, WorkoutSet $set, int $exerciseId): ?PersonalRecord
    {
        if ($set->is_warmup || ! $set->completed || (float) $set->weight_kg <= 0) {
            return null;
        }

        $existing = PersonalRecord::query()
            ->where('user_id', $user->id)
            ->where('exercise_id', $exerciseId)
            ->where('record_type', '1rm')
            ->first();

        if ($existing && ! $existing->isBeatenBy((float) $set->weight_kg, (int) $set->reps)) {
            return null;
        }

        $record = PersonalRecord::query()->updateOrCreate(
            ['user_id' => $user->id, 'exercise_id' => $exerciseId, 'record_type' => '1rm'],
            ['value' => $set->weight_kg, 'reps' => $set->reps, 'achieved_at' => now()->toDateString(), 'workout_set_id' => $set->id],
        );

        Cache::forget(CacheKeys::statsDashboard($user->id));

        PRBroken::dispatch($user);

        return $record;
    }
}
