<?php

namespace App\Listeners;

use App\Application\Gamification\Actions\AwardXpAction;
use App\Application\Gamification\Actions\EvaluateAchievementsAction;
use App\Application\Gamification\Support\GamificationResultBuilder;
use App\Domain\Gamification\Services\AchievementCatalog;
use App\Events\PRBroken;
use App\Models\PersonalRecord;

class AwardXpForPrBroken
{
    private const BASE_XP = 30;

    public function __construct(
        private readonly AwardXpAction $awardXpAction,
        private readonly EvaluateAchievementsAction $evaluateAchievementsAction,
    ) {}

    /**
     * @return array{xp_awarded: int, leveled_up: bool, new_level: int, achievements_unlocked: array<int, array{code: string, name: string, description: string, xp_bonus: int}>}
     */
    public function handle(PRBroken $event): array
    {
        $base = $this->awardXpAction->execute($event->user, self::BASE_XP);

        $prsCount = PersonalRecord::query()->where('user_id', $event->user->id)->count();

        $unlocked = $this->evaluateAchievementsAction->execute(
            $event->user, AchievementCatalog::TYPE_PRS_COUNT, $prsCount,
        );

        return GamificationResultBuilder::merge($base, $unlocked);
    }
}
