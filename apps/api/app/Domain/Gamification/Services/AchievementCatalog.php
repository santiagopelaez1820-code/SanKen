<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de gamificación.

namespace App\Domain\Gamification\Services;

/**
 * Catálogo fijo de logros (Sprint 8). No es editable desde un admin todavía
 * — es la única fuente de verdad, usada tanto por AchievementSeeder (para
 * poblar la tabla `achievements`) como por EvaluateAchievementsAction (para
 * saber qué umbrales evaluar).
 */
// Esta línea sirve para declarar el catálogo fijo de logros.
final class AchievementCatalog
{
    // Esta línea sirve para definir el tipo de logro por cantidad de sesiones.
    public const TYPE_SESSIONS_COUNT = 'sessions_count';

    // Esta línea sirve para definir el tipo de logro por días de racha.
    public const TYPE_STREAK_DAYS = 'streak_days';

    // Esta línea sirve para definir el tipo de logro por cantidad de récords.
    public const TYPE_PRS_COUNT = 'prs_count';

    /**
     * @return array<int, array{code: string, name: string, description: string, type: string, threshold: int, xp_bonus: int}>
     */
    // Esta línea sirve para declarar el método que devuelve todas las definiciones de logros.
    public static function definitions(): array
    {
        // Esta línea sirve para devolver la lista de logros.
        return [
            // Esta línea sirve para definir el logro por la primera sesión completada (50 XP).
            ['code' => 'first_workout', 'name' => 'Primer entrenamiento', 'description' => 'Completa tu primera sesión de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 1, 'xp_bonus' => 50],
            // Esta línea sirve para definir el logro por 10 sesiones completadas (100 XP).
            ['code' => 'consistent', 'name' => 'Constante', 'description' => 'Completa 10 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 10, 'xp_bonus' => 100],
            // Esta línea sirve para definir el logro por 50 sesiones completadas (500 XP).
            ['code' => 'committed', 'name' => 'Comprometido', 'description' => 'Completa 50 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 50, 'xp_bonus' => 500],
            // Esta línea sirve para definir el logro por 100 sesiones completadas (1500 XP).
            ['code' => 'veteran', 'name' => 'Veterano', 'description' => 'Completa 100 sesiones de entrenamiento.', 'type' => self::TYPE_SESSIONS_COUNT, 'threshold' => 100, 'xp_bonus' => 1500],
            // Esta línea sirve para definir el logro por 7 días seguidos entrenando (100 XP).
            ['code' => 'streak_7', 'name' => 'Racha de una semana', 'description' => 'Entrena 7 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 7, 'xp_bonus' => 100],
            // Esta línea sirve para definir el logro por 30 días seguidos entrenando (500 XP).
            ['code' => 'streak_30', 'name' => 'Racha de un mes', 'description' => 'Entrena 30 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 30, 'xp_bonus' => 500],
            // Esta línea sirve para definir el logro por 100 días seguidos entrenando (2000 XP).
            ['code' => 'streak_100', 'name' => 'Racha de cien', 'description' => 'Entrena 100 días seguidos.', 'type' => self::TYPE_STREAK_DAYS, 'threshold' => 100, 'xp_bonus' => 2000],
            // Esta línea sirve para definir el logro por el primer récord personal (50 XP).
            ['code' => 'pr_first', 'name' => 'Primer récord', 'description' => 'Consigue tu primer récord personal.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 1, 'xp_bonus' => 50],
            // Esta línea sirve para definir el logro por 10 récords personales (200 XP).
            ['code' => 'pr_10', 'name' => 'Rompe récords', 'description' => 'Consigue 10 récords personales.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 10, 'xp_bonus' => 200],
            // Esta línea sirve para definir el logro por 25 récords personales (500 XP).
            ['code' => 'pr_25', 'name' => 'Elite', 'description' => 'Consigue 25 récords personales.', 'type' => self::TYPE_PRS_COUNT, 'threshold' => 25, 'xp_bonus' => 500],
        ];
    }

    /**
     * @return array<int, array{code: string, name: string, description: string, type: string, threshold: int, xp_bonus: int}>
     */
    // Esta línea sirve para declarar el método que devuelve los logros de un tipo.
    public static function byType(string $type): array
    {
        // Esta línea sirve para devolver la lista filtrada y reindexada.
        return array_values(array_filter(
            // Esta línea sirve para partir de todas las definiciones.
            self::definitions(),
            // Esta línea sirve para quedarse solo con las del tipo pedido.
            fn (array $definition) => $definition['type'] === $type,
        ));
    }
}
