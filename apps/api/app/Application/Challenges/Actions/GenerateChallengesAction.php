<?php

namespace App\Application\Challenges\Actions;

use App\Domain\Challenges\Services\ChallengeCatalog;
use App\Models\Challenge;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Crea la instancia de la semana/mes actual de cada plantilla de
 * ChallengeCatalog, si todavía no existe. A diferencia de
 * RecalculateRankingsAction (delete+reinsert completo), acá un reto ya
 * creado y con participantes no debe desaparecer si el comando se corre de
 * nuevo a mitad de semana/mes — por eso se busca antes de crear en vez de
 * borrar todo.
 */
class GenerateChallengesAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function handle(): int
    {
        $now = Carbon::now();
        $created = 0;

        foreach (ChallengeCatalog::templates() as $template) {
            [$startsAt, $endsAt] = $template['type'] === ChallengeCatalog::TYPE_WEEKLY
                ? [$now->clone()->startOfWeek(), $now->clone()->endOfWeek()]
                : [$now->clone()->startOfMonth(), $now->clone()->endOfMonth()];

            // No usamos firstOrCreate() con 'starts_at' en el array de
            // búsqueda: el cast `date` persiste como datetime completo
            // (Y-m-d H:i:s) al guardar, así que una igualdad exacta contra
            // el string "Y-m-d" en el WHERE de la búsqueda nunca matchea la
            // fila existente — mismo problema, mismo fix, que
            // AggregateDailyStatsAction con user_stats_daily.stat_date.
            $exists = Challenge::query()
                ->where('code', $template['code'])
                ->whereDate('starts_at', $startsAt->toDateString())
                ->exists();

            if ($exists) {
                continue;
            }

            Challenge::query()->create([
                'code' => $template['code'],
                'title' => $template['title'],
                'description' => $template['description'],
                'type' => $template['type'],
                'criteria' => ['metric' => $template['metric'], 'target' => $template['target']],
                'starts_at' => $startsAt->toDateString(),
                'ends_at' => $endsAt->toDateString(),
            ]);
            $created++;
        }

        return $created;
    }
}
