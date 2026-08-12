<?php

namespace App\Listeners;

use App\Application\Gamification\Actions\EvaluateAchievementsAction;
use App\Domain\Gamification\Services\AchievementCatalog;
use App\Events\StreakMilestone;

class EvaluateStreakAchievement
{
    public function __construct(
        private readonly EvaluateAchievementsAction $evaluateAchievementsAction,
    ) {}

    public function handle(StreakMilestone $event): void
    {
        $this->evaluateAchievementsAction->execute($event->user, AchievementCatalog::TYPE_STREAK_DAYS, $event->streakDays);
    }
}
