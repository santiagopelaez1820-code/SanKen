<?php

namespace App\Application\Rankings\Actions;

use App\Domain\Rankings\Services\RankingScopeResolver;
use App\Models\PersonalRecord;
use App\Models\RankingSnapshot;
use App\Models\User;
use App\Models\UserStatsDaily;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Recalcula `ranking_snapshots` para las 7 vistas (global, ciudad, país,
 * gimnasio, edad, sexo, categoría de fuerza) a partir de los usuarios con
 * is_public_profile=true. Se dispara por el comando `rankings:recalculate`
 * (programado vía Schedule::, o a mano en dev — ver bootstrap/app.php),
 * no por un evento de dominio: es un recálculo completo de tabla, no una
 * actualización incremental por usuario/evento.
 */
class RecalculateRankingsAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    private const SCOPES = ['global', 'city', 'country', 'gym', 'age_bracket', 'sex', 'strength_category'];

    public function handle(RankingScopeResolver $resolver): int
    {
        $totalVolumeByUser = UserStatsDaily::query()
            ->selectRaw('user_id, SUM(total_volume_kg) as total_volume_kg')
            ->groupBy('user_id')
            ->pluck('total_volume_kg', 'user_id');

        $best1RmByUser = PersonalRecord::query()
            ->where('record_type', '1rm')
            ->selectRaw('user_id, MAX(value) as best_1rm')
            ->groupBy('user_id')
            ->pluck('best_1rm', 'user_id');

        $candidates = User::query()
            ->where('is_public_profile', true)
            ->with('profile.city')
            ->get()
            ->map(fn (User $u) => [
                'user_id' => $u->id,
                'metric_value' => round((float) ($totalVolumeByUser[$u->id] ?? 0), 2),
                'scopes' => $resolver->resolve(
                    $u->profile,
                    isset($best1RmByUser[$u->id]) ? (float) $best1RmByUser[$u->id] : null,
                ),
            ]);

        $rows = collect();
        foreach (self::SCOPES as $scopeType) {
            $candidates
                ->filter(fn (array $c) => $scopeType === 'global' || $c['scopes'][$scopeType] !== null)
                ->groupBy(fn (array $c) => $c['scopes'][$scopeType] ?? '__global__')
                ->each(function (Collection $group, string $key) use (&$rows, $scopeType) {
                    $rows = $rows->merge($this->rankGroup($scopeType, $key === '__global__' ? null : $key, $group));
                });
        }

        $now = now();
        DB::transaction(function () use ($rows, $now) {
            // DELETE, nunca TRUNCATE: TRUNCATE hace commit implícito en
            // InnoDB/MySQL y dejaría el leaderboard vacío a mitad de
            // recálculo para lectores concurrentes. DELETE queda dentro de
            // esta transacción — con REPEATABLE READ (default de MySQL),
            // los lectores siguen viendo el snapshot anterior completo
            // hasta que esta transacción hace commit.
            RankingSnapshot::query()->delete();

            $rows->chunk(500)->each(fn (Collection $chunk) => RankingSnapshot::insert(
                $chunk->map(fn (array $r) => [...$r, 'snapshot_date' => $now->toDateString(), 'created_at' => $now, 'updated_at' => $now])->all(),
            ));
        });

        return $rows->count();
    }

    /**
     * Ranking de competición (1,2,2,4): los empates comparten posición.
     *
     * @return Collection<int, array{user_id: int, scope_type: string, scope_value: ?string, metric_value: float, rank_position: int}>
     */
    private function rankGroup(string $scopeType, ?string $scopeValue, Collection $group): Collection
    {
        $rank = 0;
        $previousValue = null;
        $position = 0;

        return $group->sortByDesc('metric_value')->values()->map(function (array $c) use (&$rank, &$previousValue, &$position, $scopeType, $scopeValue) {
            $position++;
            if ($c['metric_value'] !== $previousValue) {
                $rank = $position;
                $previousValue = $c['metric_value'];
            }

            return [
                'user_id' => $c['user_id'],
                'scope_type' => $scopeType,
                'scope_value' => $scopeValue,
                'metric_value' => $c['metric_value'],
                'rank_position' => $rank,
            ];
        });
    }
}
