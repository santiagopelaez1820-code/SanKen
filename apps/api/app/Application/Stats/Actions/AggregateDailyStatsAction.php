<?php

namespace App\Application\Stats\Actions;

use App\Domain\Stats\Services\StreakCalculator;
use App\Events\StreakMilestone;
use App\Models\User;
use App\Models\UserStatsDaily;
use App\Models\WorkoutSession;
use App\Support\CacheKeys;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

/**
 * Recalcula el agregado diario (user_stats_daily) de un usuario para una
 * fecha dada. Se dispara al completar una sesión de entrenamiento (ver
 * CompleteWorkoutSessionAction). Corre en cola: agregar no debe bloquear el
 * cierre de la sesión.
 */
class AggregateDailyStatsAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly string $date,
    ) {}

    public function handle(StreakCalculator $streakCalculator): UserStatsDaily
    {
        $sessions = WorkoutSession::query()
            ->where('user_id', $this->user->id)
            ->whereDate('performed_at', $this->date)
            ->where('completed', true)
            ->with('exercises.sets')
            ->get();

        $workingSets = $sessions
            ->flatMap(fn (WorkoutSession $session) => $session->exercises)
            ->flatMap(fn ($exercise) => $exercise->sets)
            ->filter(fn ($set) => $set->completed && ! $set->is_warmup);

        $totalVolumeKg = $workingSets->sum(fn ($set) => (float) $set->weight_kg * $set->reps);

        $workoutDates = WorkoutSession::query()
            ->where('user_id', $this->user->id)
            ->where('completed', true)
            ->whereDate('performed_at', '<=', $this->date)
            ->distinct()
            ->pluck('performed_at')
            ->map(fn ($date) => $date->toDateString())
            ->all();

        $streak = $streakCalculator->calculate($workoutDates, CarbonImmutable::parse($this->date));

        // No usamos updateOrCreate() con 'stat_date' en el where: el cast
        // `date` persiste como datetime completo (Y-m-d H:i:s), así que una
        // igualdad exacta contra el string "Y-m-d" nunca matchea la fila
        // existente y termina duplicándola (choca con el índice único).
        $stat = UserStatsDaily::query()
            ->where('user_id', $this->user->id)
            ->whereDate('stat_date', $this->date)
            ->first() ?? new UserStatsDaily(['user_id' => $this->user->id, 'stat_date' => $this->date]);

        $previousStreak = (int) ($stat->current_streak_days ?? 0);

        $stat->fill([
            'workouts_count' => $sessions->count(),
            'total_sets' => $workingSets->count(),
            'total_volume_kg' => round($totalVolumeKg, 2),
            'training_minutes' => (int) $sessions->sum('duration_minutes'),
            'current_streak_days' => $streak,
        ])->save();

        Cache::forget(CacheKeys::statsDashboard($this->user->id));

        // Solo dispara si el umbral se cruza recién ahora, no en cada
        // recálculo posterior mientras la racha se mantenga por encima.
        $crossedMilestone = collect([7, 30, 100])->first(fn (int $m) => $previousStreak < $m && $streak >= $m);
        if ($crossedMilestone !== null) {
            StreakMilestone::dispatch($this->user, $streak);
        }

        return $stat;
    }
}
