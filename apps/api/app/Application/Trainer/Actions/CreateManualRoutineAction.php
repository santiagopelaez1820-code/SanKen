<?php

namespace App\Application\Trainer\Actions;

use App\Application\Trainer\Actions\Concerns\SyncsRoutineDays;
use App\Models\Routine;
use App\Models\TrainerClient;
use App\Models\User;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Crea una rutina manual (source=trainer) para un cliente. El motor
 * automático nunca sobrescribe estas rutinas (ver EloquentRoutineRepository).
 */
class CreateManualRoutineAction
{
    use SyncsRoutineDays;

    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(User $trainer, TrainerClient $trainerClient, array $data): Routine
    {
        if ($trainerClient->status !== 'active') {
            throw ValidationException::withMessages([
                'trainer_client' => ['Solo puedes asignar rutinas a clientes con una relación activa.'],
            ]);
        }

        $routine = DB::transaction(function () use ($trainer, $trainerClient, $data) {
            $trainerClient->client->routines()->where('is_active', true)->update(['is_active' => false]);

            $routine = Routine::query()->create([
                'user_id' => $trainerClient->client_id,
                'created_by_trainer_id' => $trainer->id,
                'source' => 'trainer',
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

        Cache::forget(CacheKeys::activeRoutine($trainerClient->client_id));

        return $routine;
    }
}
