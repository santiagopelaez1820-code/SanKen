<?php

namespace App\Domain\Challenges\Services;

use App\Models\Challenge;
use App\Models\ChallengeParticipant;
use Illuminate\Support\Collection;

/**
 * Arma el top 10 + el propio participante (si quedó fuera del top 10) de un
 * reto. Única fuente de verdad tanto para la lectura inicial
 * (GET /challenges/{id}/leaderboard, antes de que el websocket tome la
 * posta) como para el payload que RecalculateChallengeProgressAction manda
 * por Reverb — así ambos caminos siempre muestran exactamente la misma
 * forma de datos.
 */
final class ChallengeLeaderboardBuilder
{
    private const LIMIT = 10;

    /**
     * @return array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>
     */
    public function build(Challenge $challenge, ?int $viewerUserId = null): array
    {
        $participants = ChallengeParticipant::query()
            ->where('challenge_id', $challenge->id)
            ->with('user:id,name')
            ->orderByDesc('progress_value')
            ->get();

        $ranked = $this->rank($participants);

        $entries = $ranked->take(self::LIMIT);

        $viewerEntry = $viewerUserId !== null ? $ranked->firstWhere('user_id', $viewerUserId) : null;
        if ($viewerEntry !== null && ! $entries->contains('user_id', $viewerUserId)) {
            $entries = $entries->push($viewerEntry);
        }

        return $entries
            ->map(fn (array $entry) => [...$entry, 'is_viewer' => $entry['user_id'] === $viewerUserId])
            ->values()
            ->all();
    }

    /**
     * Ranking de competición (1,2,2,4): los empates comparten posición.
     * Mismo criterio que RecalculateRankingsAction::rankGroup.
     *
     * @return Collection<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool}>
     */
    private function rank(Collection $participants): Collection
    {
        $rank = 0;
        $previousValue = null;
        $position = 0;

        return $participants->map(function (ChallengeParticipant $participant) use (&$rank, &$previousValue, &$position) {
            $position++;
            $value = (float) $participant->progress_value;
            if ($value !== $previousValue) {
                $rank = $position;
                $previousValue = $value;
            }

            return [
                'rank' => $rank,
                'user_id' => $participant->user_id,
                'user_name' => $participant->user->name,
                'progress_value' => $value,
                'completed' => $participant->completed,
            ];
        });
    }
}
