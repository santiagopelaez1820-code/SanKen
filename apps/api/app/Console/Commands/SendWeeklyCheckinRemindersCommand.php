<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los comandos de consola.

namespace App\Console\Commands;

// Esta línea sirve para importar el servicio del check-in semanal.
use App\Domain\Support\Services\WeeklyCheckinService;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar la notificación de check-in disponible.
use App\Notifications\WeeklyCheckinAvailableNotification;
// Esta línea sirve para importar la clase base de los comandos de Artisan.
use Illuminate\Console\Command;
// Esta línea sirve para importar la clase Collection para el tipo del bloque de usuarios.
use Illuminate\Support\Collection;

/**
 * Aviso semanal "¿Cómo te fue esta semana?" a los usuarios elegibles.
 * Programado los viernes (bootstrap/app.php), pero se puede correr a mano:
 * es idempotente — cada check-in guarda notified_at y nunca se avisa dos
 * veces la misma semana, ni a quien ya respondió o agotó sus "Ahora no".
 *
 * En este entorno de desarrollo no hay cron (ver bootstrap/app.php): sin él
 * el aviso push no sale solo, pero el check-in igual se ofrece al abrir la
 * app (GET /support/check-ins/current).
 */
// Esta línea sirve para declarar el comando que envía el aviso del check-in semanal.
class SendWeeklyCheckinRemindersCommand extends Command
{
    // Esta línea sirve para definir el nombre del comando.
    protected $signature = 'support:weekly-checkin-reminders';

    // Esta línea sirve para definir la descripción que se muestra en la ayuda de Artisan.
    protected $description = 'Crea el check-in semanal y envía el aviso a los usuarios que todavía no lo recibieron esta semana';

    // Esta línea sirve para declarar el método principal que recibe el servicio de check-ins.
    public function handle(WeeklyCheckinService $checkins): int
    {
        // Esta línea sirve para revisar si la ventana del check-in todavía no está abierta.
        if (! $checkins->isWindowOpen()) {
            // Esta línea sirve para avisar que aún no está disponible.
            $this->info('El check-in de esta semana todavía no está disponible (se ofrece desde el viernes).');

            // Esta línea sirve para terminar con éxito sin enviar nada.
            return self::SUCCESS;
        }

        // Esta línea sirve para iniciar el contador de avisos enviados.
        $sent = 0;

        // Esta línea sirve para recorrer los usuarios elegibles en bloques de 200.
        $checkins->eligibleUsersQuery(User::query())->chunkById(200, function (Collection $users) use ($checkins, &$sent) {
            // Esta línea sirve para recorrer cada usuario del bloque.
            foreach ($users as $user) {
                // Esta línea sirve para obtener el check-in de esta semana del usuario.
                $checkin = $checkins->currentFor($user);

                // Esta línea sirve para revisar si no hay check-in, ya se avisó o ya no está pendiente.
                if (! $checkin || $checkin->notified_at || ! in_array($checkin->status, [WeeklyCheckin::STATUS_PENDING, WeeklyCheckin::STATUS_POSTPONED], true)) {
                    // Esta línea sirve para saltar al siguiente usuario.
                    continue;
                }

                // Esta línea sirve para enviar la notificación de check-in disponible.
                $user->notify(new WeeklyCheckinAvailableNotification($checkin));
                // Esta línea sirve para guardar la fecha del aviso para no repetirlo.
                $checkin->forceFill(['notified_at' => now()])->save();
                // Esta línea sirve para sumar uno a los avisos enviados.
                $sent++;
            }
        });

        // Esta línea sirve para mostrar cuántos avisos se enviaron y de qué semana.
        $this->info("Avisos de check-in enviados: {$sent} (semana {$checkins->weekKey()}).");

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }
}
