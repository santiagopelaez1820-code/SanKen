<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de retos.

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
// Esta línea sirve para declarar el catálogo de métricas y tipos de retos.
final class ChallengeCatalog
{
    // Esta línea sirve para definir la métrica "cantidad de entrenamientos".
    public const METRIC_WORKOUTS_COUNT = 'workouts_count';

    // Esta línea sirve para definir la métrica "volumen total en kilos".
    public const METRIC_TOTAL_VOLUME_KG = 'total_volume_kg';

    // Esta línea sirve para definir el tipo de reto semanal.
    public const TYPE_WEEKLY = 'weekly';

    // Esta línea sirve para definir el tipo de reto mensual.
    public const TYPE_MONTHLY = 'monthly';
}
