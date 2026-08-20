<?php

/**
 * Catálogo estático del cuestionario de onboarding. Ver docs/02-modelo-datos-bd.md
 * (domain_config) — por ahora vive en config porque el catálogo todavía no
 * cambia con frecuencia. `frequency_days` ya NO vive acá — ahora es
 * dinámico, ver RoutineTemplate::activeFrequencyDays() (Super Admin agrega
 * una plantilla nueva y esa frecuencia queda disponible sin deploy).
 */
return [
    'levels' => ['beginner', 'intermediate', 'advanced'],

    'goals' => [
        'gain_muscle',
        'lose_fat',
        'body_recomposition',
        'strength',
        'endurance',
        'sport_performance',
        'health',
        'cardio',
    ],

    'equipment' => [
        'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
        'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
    ],
];
