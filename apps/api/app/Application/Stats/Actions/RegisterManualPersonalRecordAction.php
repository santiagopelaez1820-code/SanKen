<?php

namespace App\Application\Stats\Actions;

use App\Models\PersonalRecord;
use App\Models\User;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;

/**
 * Registro voluntario de un PR (pestaña "PR", totalmente aparte del flujo de
 * entrenamiento) — replica el mismo guard "el mejor gana, nunca baja" de
 * DetectPersonalRecordAction, pero sin crear ni tocar WorkoutSession,
 * WorkoutExercise ni WorkoutSet: workout_set_id queda null.
 */
class RegisterManualPersonalRecordAction
{
    public function execute(User $user, int $exerciseId, float $weightKg, int $reps): ?PersonalRecord
    {
        $estimated1Rm = round($weightKg * (1 + $reps / 30), 2);

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
            ['value' => $estimated1Rm, 'achieved_at' => now()->toDateString(), 'workout_set_id' => null],
        );

        Cache::forget(CacheKeys::statsDashboard($user->id));

        return $record;
    }
}
