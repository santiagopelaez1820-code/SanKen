<?php

namespace App\Domain\Challenges\Services;

/**
 * Catálogo de METRICAS/TIPOS soportados por el sistema de retos — no de
 * plantillas (esas viven en la tabla challenge_templates, editable desde
 * admin, ver ChallengeTemplate/AdminChallengeTemplateController). Cada
 * métrica de acá necesita su propio método en ChallengeProgressCalculator;
 * agregar una nueva sigue requiriendo código, no es data-driven — no hay
 * forma razonable de calcular progreso arbitrario sin un motor de reglas
 * nuevo, que sería sobre-ingeniería para esta app.
 */
final class ChallengeCatalog
{
    public const METRIC_WORKOUTS_COUNT = 'workouts_count';

    public const METRIC_TOTAL_VOLUME_KG = 'total_volume_kg';

    public const TYPE_WEEKLY = 'weekly';

    public const TYPE_MONTHLY = 'monthly';
}
