<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los comandos de consola.

namespace App\Console\Commands;

// Esta línea sirve para importar la acción que crea los retos del período.
use App\Application\Challenges\Actions\GenerateChallengesAction;
// Esta línea sirve para importar la clase base de los comandos de Artisan.
use Illuminate\Console\Command;

// Esta línea sirve para declarar el comando que genera los retos de la semana y el mes.
class GenerateChallengesCommand extends Command
{
    // Esta línea sirve para definir el nombre del comando.
    protected $signature = 'challenges:generate';

    // Esta línea sirve para definir la descripción que se muestra en la ayuda de Artisan.
    protected $description = 'Crea la instancia de la semana/mes actual de cada plantilla de reto (ChallengeCatalog), si no existe todavía.';

    // Esta línea sirve para declarar el método principal del comando.
    public function handle(): int
    {
        // Esta línea sirve para ejecutar en el momento la acción que crea los retos y guardar cuántos creó.
        $count = GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para mostrar cuántos retos se crearon.
        $this->info("Retos creados: {$count}.");

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }
}
