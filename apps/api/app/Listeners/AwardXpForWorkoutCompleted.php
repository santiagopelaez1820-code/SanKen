<?php

namespace App\Listeners;

use App\Application\Gamification\Actions\AwardXpAction;
use App\Application\Gamification\Actions\EvaluateAchievementsAction;
use App\Application\Gamification\Support\GamificationResultBuilder;
use App\Domain\Gamification\Services\AchievementCatalog;
use App\Events\WorkoutCompleted;
use App\Models\WorkoutSession;

class AwardXpForWorkoutCompleted
{
    private const BASE_XP = 20;

    public function __construct(
        private readonly AwardXpAction $awardXpAction,
        private readonly EvaluateAchievementsAction $evaluateAchievementsAction,
    ) {}

    /**
     * @return array{xp_awarded: int, leveled_up: bool, new_level: int, achievements_unlocked: array<int, array{code: string, name: string, description: string, xp_bonus: int}>}
     */
    public function handle(WorkoutCompleted $event): array
    {
        $base = $this->awardXpAction->execute($event->user, self::BASE_XP);

        $sessionsCount = WorkoutSession::query()
            ->where('user_id', $event->user->id)
            ->where('completed', true)
            ->count();

        $unlocked = $this->evaluateAchievementsAction->execute(
            $event->user, AchievementCatalog::TYPE_SESSIONS_COUNT, $sessionsCount,
        );

        return GamificationResultBuilder::merge($base, $unlocked);
    }
}
