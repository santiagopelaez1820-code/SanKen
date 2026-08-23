<?php

/**
 * Parámetros del motor de rutinas. Ver docs/01-arquitectura.md (sección 6).
 * Al igual que config/onboarding.php, esto es candidato a migrar a una tabla
 * `domain_config` editable sin deploy en una fase posterior — por ahora vive
 * aquí porque el catálogo todavía no cambia con frecuencia.
 */
return [

    /*
     * Selección de split por frecuencia semanal. "muscles" son slugs de
     * muscle_groups. El type debe coincidir con el enum routines.split_type.
     */
    'splits' => [
        3 => [
            'type' => 'full_body',
            'days' => [
                ['label' => 'Full Body A', 'muscles' => ['chest', 'back', 'quads', 'shoulders', 'hamstrings', 'core']],
                ['label' => 'Full Body B', 'muscles' => ['back', 'chest', 'hamstrings', 'biceps', 'quads', 'core']],
                ['label' => 'Full Body C', 'muscles' => ['quads', 'shoulders', 'back', 'triceps', 'glutes', 'core']],
            ],
        ],
        4 => [
            'type' => 'upper_lower',
            'days' => [
                ['label' => 'Upper A', 'muscles' => ['chest', 'back', 'shoulders', 'biceps', 'triceps']],
                ['label' => 'Lower A', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves', 'core']],
                ['label' => 'Upper B', 'muscles' => ['back', 'chest', 'shoulders', 'triceps', 'biceps']],
                ['label' => 'Lower B', 'muscles' => ['hamstrings', 'quads', 'glutes', 'calves', 'core']],
            ],
        ],
        5 => [
            'type' => 'upper_lower',
            'days' => [
                ['label' => 'Upper', 'muscles' => ['chest', 'back', 'shoulders', 'biceps', 'triceps']],
                ['label' => 'Lower', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
            ],
        ],
        6 => [
            'type' => 'push_pull_legs',
            'days' => [
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
            ],
        ],
    ],

    /*
     * Series, repeticiones, RIR y descanso por objetivo. El primer objetivo
     * elegido por el usuario en el onboarding es el que decide la estrategia.
     */
    'goal_parameters' => [
        'gain_muscle' => ['target_reps' => '8-12', 'sets' => 4, 'rir' => 2.0, 'rest_seconds' => 90],
        'body_recomposition' => ['target_reps' => '8-12', 'sets' => 3, 'rir' => 2.0, 'rest_seconds' => 75],
        'strength' => ['target_reps' => '3-6', 'sets' => 5, 'rir' => 2.0, 'rest_seconds' => 180],
        'sport_performance' => ['target_reps' => '4-6', 'sets' => 4, 'rir' => 2.0, 'rest_seconds' => 150],
        'lose_fat' => ['target_reps' => '12-15', 'sets' => 3, 'rir' => 1.5, 'rest_seconds' => 60],
        'health' => ['target_reps' => '10-15', 'sets' => 3, 'rir' => 2.5, 'rest_seconds' => 60],
        'endurance' => ['target_reps' => '15-20', 'sets' => 3, 'rir' => 2.5, 'rest_seconds' => 45],
        'cardio' => ['target_reps' => '15-20', 'sets' => 2, 'rir' => 3.0, 'rest_seconds' => 30],
    ],

    /*
     * Cuántos ejercicios se asignan por grupo muscular en un día, según nivel
     * (aproximación simplificada de MEV/MAV/MRV — a mayor nivel, más volumen
     * tolerado por sesión).
     */
    'exercises_per_muscle_by_level' => [
        'beginner' => 1,
        'intermediate' => 2,
        'advanced' => 2,
    ],

    /*
     * Techo de ejercicios totales por sesión según el tiempo disponible,
     * asumiendo ~8-10 minutos por ejercicio incluyendo descansos.
     */
    'max_exercises_by_session_minutes' => [
        30 => 4,
        45 => 5,
        60 => 7,
        90 => 10,
    ],
];
