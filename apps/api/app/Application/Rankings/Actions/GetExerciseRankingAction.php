<?php

namespace App\Application\Rankings\Actions;

use App\Domain\Rankings\Services\RankingScopeResolver;
use App\Models\City;
use App\Models\Country;
use App\Models\Exercise;
use App\Models\PrSubmission;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Ranking en vivo (sin snapshot ni cron) del mejor 1RM aprobado por
 * ejercicio, filtrado por país/ciudad del perfil del usuario que consulta
 * — nunca por un valor arbitrario en la URL — y por sexo (filtro explícito
 * que el que consulta elige, ver $sex).
 *
 * Fuente de datos: SOLO PrSubmission con status='approved' (postulación
 * con video, revisada por Super Admin — ver PrSubmissionController/
 * AdminPrSubmissionController). PersonalRecord (detección automática en
 * el entrenamiento / registro manual privado) nunca alimenta esto — es
 * intencional, ver la sección "PR y Rankings" del pedido: un usuario ve
 * sus propios PersonalRecord en su historial privado, pero Rankings
 * públicos exigen la revisión con video.
 */
class GetExerciseRankingAction
{
    private const LIMIT = 100;

    /**
     * @return array{scope: string, scope_label: ?string, sex: string, exercise_id: int, exercise_name: string, entries: array<int, array<string, mixed>>, viewer: ?array<string, mixed>}
     */
    public function execute(Exercise $exercise, string $scope, string $sex, User $viewer, RankingScopeResolver $resolver): array
    {
        $scopeValue = $scope === 'global' ? null : $resolver->resolve($viewer->profile)[$scope];

        if ($scope !== 'global' && $scopeValue === null) {
            return [
                'scope' => $scope,
                'scope_label' => null,
                'sex' => $sex,
                'exercise_id' => $exercise->id,
                'exercise_name' => $exercise->name,
                'entries' => [],
                'viewer' => null,
            ];
        }

        $submissions = PrSubmission::query()
            ->where('exercise_id', $exercise->id)
            ->where('status', 'approved')
            ->whereHas('user', fn ($q) => $q->where('is_public_profile', true)
                ->whereHas('profile', fn ($q2) => $q2->where('sex', $sex)))
            ->with('user.profile.city')
            ->get()
            ->filter(fn (PrSubmission $submission) => $this->matchesScope($submission, $scope, $scopeValue));

        // Un usuario puede tener varias postulaciones aprobadas para el
        // mismo ejercicio (distintos intentos) — solo cuenta la mejor.
        $bestPerUser = $submissions
            ->groupBy('user_id')
            ->map(fn (Collection $group) => $group->sortByDesc(fn (PrSubmission $s) => (float) $s->estimated_1rm)->first());

        $ranked = $this->rankGroup($bestPerUser->values());

        $viewerRow = $ranked->first(fn (array $row) => $row['user_id'] === $viewer->id);

        return [
            'scope' => $scope,
            'scope_label' => $this->scopeLabel($scope, $scopeValue),
            'sex' => $sex,
            'exercise_id' => $exercise->id,
            'exercise_name' => $exercise->name,
            'entries' => $ranked->take(self::LIMIT)->map(fn (array $row) => $this->toEntry($row, $viewer))->values()->all(),
            'viewer' => $viewerRow ? $this->toEntry($viewerRow, $viewer) : null,
        ];
    }

    private function matchesScope(PrSubmission $submission, string $scope, ?string $scopeValue): bool
    {
        if ($scope === 'global') {
            return true;
        }

        $profile = $submission->user->profile;

        if ($scope === 'city') {
            return $profile?->city_id !== null && (string) $profile->city_id === $scopeValue;
        }

        return $profile?->city?->country_id !== null && (string) $profile->city->country_id === $scopeValue;
    }

    /**
     * Ranking de competición (1,2,2,4): los empates comparten posición.
     *
     * @param  Collection<int, PrSubmission>  $submissions
     * @return Collection<int, array{user_id: int, user_name: string, metric_value: float, rank: int}>
     */
    private function rankGroup(Collection $submissions): Collection
    {
        $rank = 0;
        $previousValue = null;
        $position = 0;

        return $submissions
            ->sortByDesc(fn (PrSubmission $s) => (float) $s->estimated_1rm)
            ->values()
            ->map(function (PrSubmission $s) use (&$rank, &$previousValue, &$position) {
                $value = (float) $s->estimated_1rm;
                $position++;
                if ($value !== $previousValue) {
                    $rank = $position;
                    $previousValue = $value;
                }

                return [
                    'user_id' => $s->user_id,
                    'user_name' => $s->user->name,
                    'metric_value' => $value,
                    'rank' => $rank,
                ];
            });
    }

    /**
     * @param  array{user_id: int, user_name: string, metric_value: float, rank: int}  $row
     */
    private function toEntry(array $row, User $viewer): array
    {
        return [
            'rank' => $row['rank'],
            'user_id' => $row['user_id'],
            'user_name' => $row['user_name'],
            'metric_value' => $row['metric_value'],
            'is_viewer' => $row['user_id'] === $viewer->id,
        ];
    }

    private function scopeLabel(string $scope, ?string $scopeValue): ?string
    {
        return match ($scope) {
            'global' => 'Global',
            'city' => City::find($scopeValue)?->name,
            'country' => Country::find($scopeValue)?->name,
            default => null,
        };
    }
}
