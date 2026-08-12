<?php

namespace App\Application\Gamification\Actions;

use App\Domain\Gamification\Services\AchievementCatalog;
use App\Models\Achievement;
use App\Models\User;
use App\Models\UserAchievement;

class EvaluateAchievementsAction
{
    public function __construct(
        private readonly AwardXpAction $awardXpAction,
    ) {}

    /**
     * @return array<int, array{achievement: Achievement, xp_result: array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}}>
     */
    public function execute(User $user, string $type, int $currentValue): array
    {
        $unlockedIds = UserAchievement::query()->where('user_id', $user->id)->pluck('achievement_id')->all();
        $newlyUnlocked = [];

        foreach (AchievementCatalog::byType($type) as $definition) {
            if ($currentValue < $definition['threshold']) {
                continue;
            }

            $achievement = Achievement::query()->where('code', $definition['code'])->first();

            if (! $achievement || in_array($achievement->id, $unlockedIds, true)) {
                continue;
            }

            UserAchievement::query()->create([
                'user_id' => $user->id,
                'achievement_id' => $achievement->id,
                'achieved_at' => now(),
            ]);

            $newlyUnlocked[] = [
                'achievement' => $achievement,
                'xp_result' => $this->awardXpAction->execute($user, $achievement->xp_bonus),
            ];
        }

        return $newlyUnlocked;
    }
}
