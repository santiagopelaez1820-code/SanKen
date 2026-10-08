<?php

/**
 * Parámetros del motor de rutinas. Ver docs/01-arquitectura.md (sección 6).
 * Al igual que config/onboarding.php, esto es candidato a migrar a una tabla
 * `domain_config` editable sin deploy en una fase posterior — por ahora vive
 * aquí porque el catálogo todavía no cambia con frecuencia.
 */
// Esta línea sirve para devolver los parámetros del motor de rutinas.
return [

    /*
     * Selección de split por frecuencia semanal. "muscles" son slugs de
     * muscle_groups. El type debe coincidir con el enum routines.split_type.
     */
    // Esta línea sirve para definir los splits según la frecuencia semanal.
    'splits' => [
        // Esta línea sirve para definir el split para 3 días.
        3 => [
            // Esta línea sirve para usar cuerpo completo.
            'type' => 'full_body',
            // Esta línea sirve para definir los días.
            'days' => [
                // Esta línea sirve para definir el día Full Body A con sus músculos.
                ['label' => 'Full Body A', 'muscles' => ['chest', 'back', 'quads', 'shoulders', 'hamstrings', 'core']],
                // Esta línea sirve para definir el día Full Body B con sus músculos.
                ['label' => 'Full Body B', 'muscles' => ['back', 'chest', 'hamstrings', 'biceps', 'quads', 'core']],
                // Esta línea sirve para definir el día Full Body C con sus músculos.
                ['label' => 'Full Body C', 'muscles' => ['quads', 'shoulders', 'back', 'triceps', 'glutes', 'core']],
            ],
        ],
        // Esta línea sirve para definir el split para 4 días.
        4 => [
            // Esta línea sirve para usar torso/pierna.
            'type' => 'upper_lower',
            // Esta línea sirve para definir los días.
            'days' => [
                // Esta línea sirve para definir el día Upper A con sus músculos.
                ['label' => 'Upper A', 'muscles' => ['chest', 'back', 'shoulders', 'biceps', 'triceps']],
                // Esta línea sirve para definir el día Lower A con sus músculos.
                ['label' => 'Lower A', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves', 'core']],
                // Esta línea sirve para definir el día Upper B con sus músculos.
                ['label' => 'Upper B', 'muscles' => ['back', 'chest', 'shoulders', 'triceps', 'biceps']],
                // Esta línea sirve para definir el día Lower B con sus músculos.
                ['label' => 'Lower B', 'muscles' => ['hamstrings', 'quads', 'glutes', 'calves', 'core']],
            ],
        ],
        // Esta línea sirve para definir el split para 5 días.
        5 => [
            // Esta línea sirve para usar torso/pierna.
            'type' => 'upper_lower',
            // Esta línea sirve para definir los días.
            'days' => [
                // Esta línea sirve para definir el día Upper con sus músculos.
                ['label' => 'Upper', 'muscles' => ['chest', 'back', 'shoulders', 'biceps', 'triceps']],
                // Esta línea sirve para definir el día Lower con sus músculos.
                ['label' => 'Lower', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
                // Esta línea sirve para definir el día Push con sus músculos.
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                // Esta línea sirve para definir el día Pull con sus músculos.
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                // Esta línea sirve para definir el día Legs con sus músculos.
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
            ],
        ],
        // Esta línea sirve para definir el split para 6 días.
        6 => [
            // Esta línea sirve para usar empuje/tirón/pierna.
            'type' => 'push_pull_legs',
            // Esta línea sirve para definir los días.
            'days' => [
                // Esta línea sirve para definir el día Push con sus músculos.
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                // Esta línea sirve para definir el día Pull con sus músculos.
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                // Esta línea sirve para definir el día Legs con sus músculos.
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
                // Esta línea sirve para definir el segundo día Push.
                ['label' => 'Push', 'muscles' => ['chest', 'shoulders', 'triceps']],
                // Esta línea sirve para definir el segundo día Pull.
                ['label' => 'Pull', 'muscles' => ['back', 'biceps', 'core']],
                // Esta línea sirve para definir el segundo día Legs.
                ['label' => 'Legs', 'muscles' => ['quads', 'hamstrings', 'glutes', 'calves']],
            ],
        ],
    ],

    /*
     * Series, repeticiones, RIR y descanso por objetivo. El primer objetivo
     * elegido por el usuario en el onboarding es el que decide la estrategia.
     */
    // Esta línea sirve para definir series, repeticiones, RIR y descanso por objetivo.
    'goal_parameters' => [
        // Esta línea sirve para definir los parámetros para ganar músculo.
        'gain_muscle' => ['target_reps' => '8-12', 'sets' => 4, 'rir' => 2.0, 'rest_seconds' => 90],
        // Esta línea sirve para definir los parámetros para recomposición corporal.
        'body_recomposition' => ['target_reps' => '8-12', 'sets' => 3, 'rir' => 2.0, 'rest_seconds' => 75],
        // Esta línea sirve para definir los parámetros para fuerza.
        'strength' => ['target_reps' => '3-6', 'sets' => 5, 'rir' => 2.0, 'rest_seconds' => 180],
        // Esta línea sirve para definir los parámetros para rendimiento deportivo.
        'sport_performance' => ['target_reps' => '4-6', 'sets' => 4, 'rir' => 2.0, 'rest_seconds' => 150],
        // Esta línea sirve para definir los parámetros para perder grasa.
        'lose_fat' => ['target_reps' => '12-15', 'sets' => 3, 'rir' => 1.5, 'rest_seconds' => 60],
        // Esta línea sirve para definir los parámetros para salud.
        'health' => ['target_reps' => '10-15', 'sets' => 3, 'rir' => 2.5, 'rest_seconds' => 60],
        // Esta línea sirve para definir los parámetros para resistencia.
        'endurance' => ['target_reps' => '15-20', 'sets' => 3, 'rir' => 2.5, 'rest_seconds' => 45],
        // Esta línea sirve para definir los parámetros para cardio.
        'cardio' => ['target_reps' => '15-20', 'sets' => 2, 'rir' => 3.0, 'rest_seconds' => 30],
    ],

    /*
     * Cuántos ejercicios se asignan por grupo muscular en un día, según nivel
     * (aproximación simplificada de MEV/MAV/MRV — a mayor nivel, más volumen
     * tolerado por sesión).
     */
    // Esta línea sirve para definir cuántos ejercicios por músculo según el nivel.
    'exercises_per_muscle_by_level' => [
        // Esta línea sirve para asignar 1 ejercicio a principiantes.
        'beginner' => 1,
        // Esta línea sirve para asignar 2 ejercicios a intermedios.
        'intermediate' => 2,
        // Esta línea sirve para asignar 2 ejercicios a avanzados.
        'advanced' => 2,
    ],

    /*
     * Techo de ejercicios totales por sesión según el tiempo disponible,
     * asumiendo ~8-10 minutos por ejercicio incluyendo descansos.
     */
    // Esta línea sirve para definir el máximo de ejercicios según los minutos de la sesión.
    'max_exercises_by_session_minutes' => [
        // Esta línea sirve para permitir 4 ejercicios en 30 minutos.
        30 => 4,
        // Esta línea sirve para permitir 5 ejercicios en 45 minutos.
        45 => 5,
        // Esta línea sirve para permitir 7 ejercicios en 60 minutos.
        60 => 7,
        // Esta línea sirve para permitir 10 ejercicios en 90 minutos.
        90 => 10,
    ],
];
