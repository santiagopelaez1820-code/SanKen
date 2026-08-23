<?php

namespace App\Application\Gamification\Support;

use App\Models\Achievement;

/**
 * Mezcla el resultado base de AwardXpAction con los logros recién
 * desbloqueados (cada uno con su propio otorgamiento de XP) en un solo
 * payload — el que viaja en meta.gamification de la respuesta HTTP.
 */
final class GamificationResultBuilder
{
    /**
     * @param  array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}  $base
     * @param  array<int, array{achievement: Achievement, xp_result: array{total_xp: int, xp_awarded: int, leveled_up: bool, previous_level: int, new_level: int}}>  $unlocked
     * @return array{xp_awarded: int, leveled_up: bool, new_level: int, achievements_unlocked: array<int, array{code: string, name: string, description: string, xp_bonus: int}>}
     */
    public static function merge(array $base, array $unlocked): array
    {
        $xpAwarded = $base['xp_awarded'];
        $leveledUp = $base['leveled_up'];
        $newLevel = $base['new_level'];

        foreach ($unlocked as $entry) {
            $xpAwarded += $entry['xp_result']['xp_awarded'];
            $leveledUp = $leveledUp || $entry['xp_result']['leveled_up'];
            $newLevel = max($newLevel, $entry['xp_result']['new_level']);
        }

        return [
            'xp_awarded' => $xpAwarded,
            'leveled_up' => $leveledUp,
            'new_level' => $newLevel,
            'achievements_unlocked' => array_map(static fn (array $entry) => [
                'code' => $entry['achievement']->code,
                'name' => $entry['achievement']->name,
                'description' => $entry['achievement']->description,
                'xp_bonus' => $entry['achievement']->xp_bonus,
            ], $unlocked),
        ];
    }
}
