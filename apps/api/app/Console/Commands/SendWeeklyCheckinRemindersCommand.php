<?php

namespace App\Console\Commands;

use App\Domain\Support\Services\WeeklyCheckinService;
use App\Models\User;
use App\Models\WeeklyCheckin;
use App\Notifications\WeeklyCheckinAvailableNotification;
use Illuminate\Console\Command;
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
class SendWeeklyCheckinRemindersCommand extends Command
{
    protected $signature = 'support:weekly-checkin-reminders';

    protected $description = 'Crea el check-in semanal y envía el aviso a los usuarios que todavía no lo recibieron esta semana';

    public function handle(WeeklyCheckinService $checkins): int
    {
        if (! $checkins->isWindowOpen()) {
            $this->info('El check-in de esta semana todavía no está disponible (se ofrece desde el viernes).');

            return self::SUCCESS;
        }

        $sent = 0;

        $checkins->eligibleUsersQuery(User::query())->chunkById(200, function (Collection $users) use ($checkins, &$sent) {
            foreach ($users as $user) {
                $checkin = $checkins->currentFor($user);

                if (! $checkin || $checkin->notified_at || ! in_array($checkin->status, [WeeklyCheckin::STATUS_PENDING, WeeklyCheckin::STATUS_POSTPONED], true)) {
                    continue;
                }

                $user->notify(new WeeklyCheckinAvailableNotification($checkin));
                $checkin->forceFill(['notified_at' => now()])->save();
                $sent++;
            }
        });

        $this->info("Avisos de check-in enviados: {$sent} (semana {$checkins->weekKey()}).");

        return self::SUCCESS;
    }
}
