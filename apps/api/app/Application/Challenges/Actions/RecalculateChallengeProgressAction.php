<?php

namespace App\Application\Challenges\Actions;

use App\Domain\Challenges\Services\ChallengeLeaderboardBuilder;
use App\Domain\Challenges\Services\ChallengeProgressCalculator;
use App\Events\ChallengeProgressUpdated;
use App\Models\ChallengeParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Recalcula el progreso de un usuario en cada reto activo al que está
 * unido, y transmite el leaderboard actualizado por Reverb para cada reto
 * que cambió. Se dispara síncronamente (dispatchSync) desde
 * UpdateChallengeProgressOnWorkoutCompleted, en el mismo request que
 * completa la sesión — por eso ChallengeProgressCalculator lee directo de
 * workout_sessions/workout_sets en vez de la tabla user_stats_daily (que se
 * recalcula en cola, sin garantía de orden respecto a este evento).
 */
class RecalculateChallengeProgressAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}

    public function handle(ChallengeProgressCalculator $calculator, ChallengeLeaderboardBuilder $leaderboardBuilder): void
    {
        $today = Carbon::today();

        $participations = ChallengeParticipant::query()
            ->where('user_id', $this->user->id)
            ->whereHas('challenge', function ($query) use ($today) {
                $query->whereDate('starts_at', '<=', $today)->whereDate('ends_at', '>=', $today);
            })
            ->with('challenge')
            ->get();

        foreach ($participations as $participant) {
            $challenge = $participant->challenge;
            $criteria = $challenge->criteria;

            $value = $calculator->calculate(
                $this->user->id,
                $criteria['metric'],
                $challenge->starts_at,
                $challenge->ends_at,
            );

            $participant->update([
                'progress_value' => $value,
                'completed' => $value >= $criteria['target'],
            ]);

            ChallengeProgressUpdated::dispatch($challenge, $leaderboardBuilder->build($challenge));
        }
    }
}
