<?php

/**
 * Catálogo estático del cuestionario de onboarding. Ver docs/02-modelo-datos-bd.md
 * (domain_config) — en fases posteriores esto migra a una tabla editable sin deploy;
 * por ahora vive en config porque el catálogo todavía no cambia con frecuencia.
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

    'frequency_days' => [3, 4, 5, 6],

    'session_minutes' => [30, 45, 60, 90],

    'places' => ['home', 'gym'],

    'equipment' => [
        'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
        'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
    ],
];
