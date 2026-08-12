<?php

namespace App\Domain\Challenges\Services;

/**
 * Catálogo fijo de plantillas de reto (Sprint 10). No es editable desde un
 * admin todavía — es la única fuente de verdad, consumida por
 * GenerateChallengesAction para crear la instancia de la semana/mes actual
 * de cada plantilla (identificada por `code`).
 */
final class ChallengeCatalog
{
    public const METRIC_WORKOUTS_COUNT = 'workouts_count';

    public const METRIC_TOTAL_VOLUME_KG = 'total_volume_kg';

    public const TYPE_WEEKLY = 'weekly';

    public const TYPE_MONTHLY = 'monthly';

    /**
     * @return array<int, array{code: string, title: string, description: string, type: string, metric: string, target: float}>
     */
    public static function templates(): array
    {
        return [
            [
                'code' => 'weekly_5_sessions',
                'title' => 'Racha semanal',
                'description' => 'Completa 5 entrenamientos esta semana.',
                'type' => self::TYPE_WEEKLY,
                'metric' => self::METRIC_WORKOUTS_COUNT,
                'target' => 5,
            ],
            [
                'code' => 'monthly_volume_10000',
                'title' => 'Tonelaje mensual',
                'description' => 'Mueve 10.000 kg de volumen total este mes.',
                'type' => self::TYPE_MONTHLY,
                'metric' => self::METRIC_TOTAL_VOLUME_KG,
                'target' => 10000,
            ],
        ];
    }
}
