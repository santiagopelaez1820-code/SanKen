<?php

namespace App\Domain\Gamification\Services;

/**
 * Curva de nivel simple y determinista: nivel(xp) = floor(sqrt(xp/100)) + 1.
 * Nivel 1 = 0xp, 2 = 100xp, 3 = 400xp, 4 = 900xp, 5 = 1600xp.
 */
final class XpLevelCalculator
{
    public function level(int $totalXp): int
    {
        return (int) floor(sqrt($totalXp / 100)) + 1;
    }

    public function xpForLevel(int $level): int
    {
        return 100 * ($level - 1) ** 2;
    }

    /**
     * @return array{level: int, xp_for_current_level: int, xp_for_next_level: int, progress_pct: float}
     */
    public function progress(int $totalXp): array
    {
        $level = $this->level($totalXp);
        $xpForCurrentLevel = $this->xpForLevel($level);
        $xpForNextLevel = $this->xpForLevel($level + 1);
        $span = $xpForNextLevel - $xpForCurrentLevel;

        return [
            'level' => $level,
            'xp_for_current_level' => $xpForCurrentLevel,
            'xp_for_next_level' => $xpForNextLevel,
            'progress_pct' => $span > 0 ? round(($totalXp - $xpForCurrentLevel) / $span, 4) : 1.0,
        ];
    }
}
