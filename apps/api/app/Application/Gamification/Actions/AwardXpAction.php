<?php

namespace App\Application\Gamification\Actions;

use App\Domain\Gamification\Services\XpLevelCalculator;
use App\Models\User;
use App\Models\UserXp;

class AwardXpAction
{
    public function __construct(
        private readonly XpLevelCalculator $calculator,
    ) {}

    /**
     * @return array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}
     */
    public function execute(User $user, int $amount): array
    {
        $xp = UserXp::query()->firstOrCreate(['user_id' => $user->id], ['total_xp' => 0]);
        $previousLevel = $this->calculator->level($xp->total_xp);

        $xp->increment('total_xp', $amount);

        $newLevel = $this->calculator->level($xp->total_xp);

        return [
            'total_xp' => $xp->total_xp,
            'xp_awarded' => $amount,
            'leveled_up' => $newLevel > $previousLevel,
            'previous_level' => $previousLevel,
            'new_level' => $newLevel,
        ];
    }
}
