<?php

namespace App\Application\Admin\Actions;

use App\Application\Routine\Actions\Concerns\SyncsRoutineDays;
use App\Models\Routine;
use App\Models\User;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Asigna una rutina personalizada (source=admin) a UN usuario específico —
 * desactiva cualquier rutina activa que tuviera (general o de otro origen)
 * solo para ese usuario, sin tocar a nadie más. Igual que las rutinas de
 * entrenador, el motor automático nunca la sobrescribe (ver
 * EloquentRoutineRepository::saveGenerated).
 */
class AssignPersonalRoutineAction
{
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(User $admin, User $targetUser, array $data): Routine
    {
        $routine = DB::transaction(function () use ($admin, $targetUser, $data) {
            $targetUser->routines()->where('is_active', true)->update(['is_active' => false]);

            $routine = Routine::query()->create([
                'user_id' => $targetUser->id,
                'created_by_admin_id' => $admin->id,
                'source' => 'admin',
                'goal' => $data['goal'],
                'split_type' => $data['split_type'],
                'frequency_days' => $data['frequency_days'],
                'duration_weeks' => $data['duration_weeks'],
                'is_active' => true,
                'starts_at' => now()->toDateString(),
                'ends_at' => now()->addWeeks($data['duration_weeks'])->toDateString(),
            ]);

            $this->syncRoutineDays($routine, $data['days']);

            return $routine->load('days.exercises.exercise.primaryMuscle');
        });

        Cache::forget(CacheKeys::activeRoutine($targetUser->id));

        return $routine;
    }
}
