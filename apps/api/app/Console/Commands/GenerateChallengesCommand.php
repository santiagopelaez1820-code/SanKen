<?php

namespace App\Console\Commands;

use App\Application\Challenges\Actions\GenerateChallengesAction;
use Illuminate\Console\Command;

class GenerateChallengesCommand extends Command
{
    protected $signature = 'challenges:generate';

    protected $description = 'Crea la instancia de la semana/mes actual de cada plantilla de reto (ChallengeCatalog), si no existe todavía.';

    public function handle(): int
    {
        $count = GenerateChallengesAction::dispatchSync();

        $this->info("Retos creados: {$count}.");

        return self::SUCCESS;
    }
}
