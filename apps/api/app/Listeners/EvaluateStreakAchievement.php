<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los listeners.

namespace App\Listeners;

// Esta línea sirve para importar la acción que evalúa logros.
use App\Application\Gamification\Actions\EvaluateAchievementsAction;
// Esta línea sirve para importar el catálogo de logros.
use App\Domain\Gamification\Services\AchievementCatalog;
// Esta línea sirve para importar el evento de racha alcanzada.
use App\Events\StreakMilestone;

// Esta línea sirve para declarar el listener que evalúa los logros de racha.
class EvaluateStreakAchievement
{
    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir la acción que evalúa logros.
        private readonly EvaluateAchievementsAction $evaluateAchievementsAction,
    ) {}

    // Esta línea sirve para declarar el método que atiende el evento.
    public function handle(StreakMilestone $event): void
    {
        // Esta línea sirve para evaluar los logros por días de racha.
        $this->evaluateAchievementsAction->execute($event->user, AchievementCatalog::TYPE_STREAK_DAYS, $event->streakDays);
    }
}
