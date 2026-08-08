<?php

namespace App\Application\Workout\Actions;

use App\Models\PersonalRecord;
use App\Models\User;
use App\Models\WorkoutSet;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

/**
 * Estima el 1RM (fórmula de Epley: peso × (1 + reps/30)) de la serie recién
 * registrada y actualiza el récord si supera el anterior. Series de
 * calentamiento o no completadas nunca cuentan como récord.
 */
class DetectPersonalRecordAction
{
    public function execute(User $user, WorkoutSet $set, int $exerciseId): ?PersonalRecord
    {
        if ($set->is_warmup || ! $set->completed || (float) $set->weight_kg <= 0) {
            return null;
        }

        $estimated1Rm = round((float) $set->weight_kg * (1 + $set->reps / 30), 2);

        $existing = PersonalRecord::query()
            ->where('user_id', $user->id)
            ->where('exercise_id', $exerciseId)
            ->where('record_type', '1rm')
            ->first();

        if ($existing && (float) $existing->value >= $estimated1Rm) {
            return null;
        }

        $record = PersonalRecord::query()->updateOrCreate(
            ['user_id' => $user->id, 'exercise_id' => $exerciseId, 'record_type' => '1rm'],
            ['value' => $estimated1Rm, 'achieved_at' => now()->toDateString(), 'workout_set_id' => $set->id],
        );

        Cache::forget(CacheKeys::statsDashboard($user->id));

        return $record;
    }
}
