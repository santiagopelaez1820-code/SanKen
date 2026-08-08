<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
use App\Models\Routine;
use App\Models\User;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EloquentRoutineRepository implements RoutineRepositoryInterface
{
    public function findActiveForUser(User $user): ?Routine
    {
        return Routine::query()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->first();
    }

    public function saveGenerated(User $user, GeneratedRoutine $generated): Routine
    {
        $routine = DB::transaction(function () use ($user, $generated) {
            $existingActive = $this->findActiveForUser($user);

            // El motor nunca sobrescribe una rutina asignada manualmente por un entrenador.
            if ($existingActive && $existingActive->source === 'trainer') {
                return $existingActive;
            }

            $existingActive?->update(['is_active' => false]);

            $routine = Routine::query()->create([
                'user_id' => $user->id,
                'source' => 'engine',
                'goal' => $generated->goal,
                'split_type' => $generated->splitType,
                'frequency_days' => $generated->frequencyDays,
                'duration_weeks' => $generated->durationWeeks,
                'is_active' => true,
                'starts_at' => now()->toDateString(),
                'ends_at' => now()->addWeeks($generated->durationWeeks)->toDateString(),
            ]);

            foreach ($generated->days as $day) {
                $routineDay = $routine->days()->create([
                    'day_order' => $day->order,
                    'label' => $day->label,
                    'target_muscle_groups' => $day->targetMuscleGroups,
                ]);

                foreach ($day->exercises as $exercise) {
                    $routineDay->exercises()->create([
                        'exercise_id' => $exercise->exerciseId,
                        'order' => $exercise->order,
                        'target_sets' => $exercise->targetSets,
                        'target_reps' => $exercise->targetReps,
                        'rest_seconds' => $exercise->restSeconds,
                        'target_rpe' => $exercise->targetRpe,
                        'suggested_weight_kg' => null,
                    ]);
                }
            }

            return $routine->load('days.exercises.exercise');
        });

        Cache::forget(CacheKeys::activeRoutine($user->id));

        return $routine;
    }
}
