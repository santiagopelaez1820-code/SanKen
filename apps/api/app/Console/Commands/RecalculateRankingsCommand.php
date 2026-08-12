<?php

namespace App\Console\Commands;

use App\Application\Rankings\Actions\RecalculateRankingsAction;
use Illuminate\Console\Command;

class RecalculateRankingsCommand extends Command
{
    protected $signature = 'rankings:recalculate';

    protected $description = 'Recalcula ranking_snapshots para las 7 vistas a partir de los usuarios opt-in.';

    public function handle(): int
    {
        // dispatchSync(), no dispatch(): no hay garantía de que queue:work
        // esté corriendo en este entorno (igual que AggregateDailyStatsAction
        // en tests) — este comando debe completar el recálculo por sí solo,
        // tanto invocado a mano en dev como desde Schedule::.
        $count = RecalculateRankingsAction::dispatchSync();

        $this->info("Rankings recalculados: {$count} filas.");

        return self::SUCCESS;
    }
}
