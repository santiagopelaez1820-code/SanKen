<?php

/**
 * Catálogo estático del cuestionario de onboarding. Ver docs/02-modelo-datos-bd.md
 * (domain_config) — por ahora vive en config porque el catálogo todavía no
 * cambia con frecuencia. `frequency_days` ya NO vive acá — ahora es
 * dinámico, ver RoutineTemplate::activeFrequencyDays() (Super Admin agrega
 * una plantilla nueva y esa frecuencia queda disponible sin deploy).
 */
// Esta línea sirve para devolver el catálogo del onboarding.
return [
    // Esta línea sirve para definir los niveles disponibles.
    'levels' => ['beginner', 'intermediate', 'advanced'],

    // Esta línea sirve para definir los objetivos disponibles.
    'goals' => [
        // Esta línea sirve para incluir ganar músculo.
        'gain_muscle',
        // Esta línea sirve para incluir perder grasa.
        'lose_fat',
        // Esta línea sirve para incluir recomposición corporal.
        'body_recomposition',
        // Esta línea sirve para incluir fuerza.
        'strength',
        // Esta línea sirve para incluir resistencia.
        'endurance',
        // Esta línea sirve para incluir rendimiento deportivo.
        'sport_performance',
        // Esta línea sirve para incluir salud.
        'health',
        // Esta línea sirve para incluir cardio.
        'cardio',
    ],

    // Esta línea sirve para definir el equipamiento disponible.
    'equipment' => [
        // Esta línea sirve para incluir barra, mancuernas, banco, rack de sentadillas y barra de dominadas.
        'barbell', 'dumbbells', 'bench', 'squat_rack', 'pull_up_bar',
        // Esta línea sirve para incluir poleas, máquinas, kettlebells, bandas elásticas y solo peso corporal.
        'cables', 'machines', 'kettlebells', 'resistance_bands', 'bodyweight_only',
    ],
];
