<?php

namespace App\Domain\Gamification\Services;

/**
 * Catálogo fijo de logros (Sprint 8). No es editable desde un admin todavía
 * — es la única fuente de verdad, usada tanto por AchievementSeeder (para
 * poblar la tabla `achievements`) como por EvaluateAchievementsAction (para
 * saber qué umbrales evaluar).
 */
final class AchievementCatalog
{
    public const TYPE_SESSIONS_COUNT = 'sessions_count';

    public const TYPE_STREAK_DAYS = 'streak_days';

    public const TYPE_PRS_COUNT = 'prs_count';

    /**
     * @return array<int, array{code: string, name: string, description: string, type: string, threshold: int, xp_bonus: int}>
     */
    public static function definitions(): array
    {
        return [
            ['code' => 'first_workout', 'name' => 'Primer entrenamiento', 'description' => 'Completa tu primera sesión de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 1, 'xp_bonus' => 50],
            ['code' => 'consistent', 'name' => 'Constante', 'description' => 'Completa 10 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 10, 'xp_bonus' => 100],
            ['code' => 'committed', 'name' => 'Comprometido', 'description' => 'Completa 50 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 50, 'xp_bonus' => 500],
            ['code' => 'veteran', 'name' => 'Veterano', 'description' => 'Completa 100 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 100, 'xp_bonus' => 1500],
            ['code' => 'streak_7', 'name' => 'Racha de una semana', 'description' => 'Entrena 7 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 7, 'xp_bonus' => 100],
            ['code' => 'streak_30', 'name' => 'Racha de un mes', 'description' => 'Entrena 30 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 30, 'xp_bonus' => 500],
            ['code' => 'streak_100', 'name' => 'Racha de cien', 'description' => 'Entrena 100 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 100, 'xp_bonus' => 2000],
            ['code' => 'pr_first', 'name' => 'Primer récord', 'description' => 'Consigue tu primer récord personal.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 1, 'xp_bonus' => 50],
            ['code' => 'pr_10', 'name' => 'Rompe récords', 'description' => 'Consigue 10 récords personales.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 10, 'xp_bonus' => 200],
            ['code' => 'pr_25', 'name' => 'Elite', 'description' => 'Consigue 25 récords personales.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 25, 'xp_bonus' => 500],
        ];
    }

    /**
     * @return array<int, array{code: string, name: string, description: string, type: string, threshold: int, xp_bonus: int}>
     */
    public static function byType(string $type): array
    {
        return array_values(array_filter(
            self::definitions(),
            fn (array $definition) => $definition['type'] === $type,
        ));
    }
}
