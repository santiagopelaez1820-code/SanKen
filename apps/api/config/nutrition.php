<?php

/**
 * Catálogo estático para NutritionTargetCalculator (Sprint 12). Mismo
 * criterio que config/rankings.php/config/onboarding.php: vive en config
 * porque todavía no cambia con frecuencia.
 */
return [
    // Multiplicador de actividad (Mifflin-St Jeor) inferido de frequency_days
    // (días de entrenamiento/semana) — es la única señal de actividad que
    // existe en el schema hoy, no hay un campo de "nivel de actividad" propio.
    'activity_multiplier_by_frequency' => [
        3 => 1.375, // light
        4 => 1.55,  // moderate
        5 => 1.725, // active
        6 => 1.9,   // very active
    ],

    // % de ajuste sobre TDEE según la meta primaria (primer elemento de
    // OnboardingResponse.goals, que es un array — ver nota en
    // NutritionTargetCalculator sobre por qué se usa solo el primero).
    'calorie_adjustment_by_goal' => [
        'lose_fat' => -0.20,
        'cardio' => -0.10,
        'body_recomposition' => -0.05,
        'gain_muscle' => 0.12,
        'strength' => 0.08,
        'sport_performance' => 0.0,
        'endurance' => 0.0,
        'health' => 0.0,
    ],

    // g de proteína por kg de peso corporal según meta primaria.
    'protein_g_per_kg_by_goal' => [
        'lose_fat' => 2.2, // más alto en déficit, para preservar músculo
        'gain_muscle' => 2.0,
        'strength' => 2.0,
    ],
    'default_protein_g_per_kg' => 1.6,

    'fat_pct_of_calories' => 0.25,

    'water_ml_per_kg' => 35,
    'water_ml_extra_on_training_day' => 500,

    // Plan alimenticio (GenerateNutritionPlanAction): reparte el objetivo
    // diario (de NutritionTargetCalculator) entre 4 comidas. Mismo % para
    // calorías y cada macro -- no hay razón nutricional para variar la
    // proporción de proteína/carbos/grasa entre comidas acá, mantenerlo
    // simple. Suman 1.0.
    'meal_split_ratio' => [
        'breakfast' => 0.25,
        'lunch' => 0.35,
        'snack' => 0.10,
        'dinner' => 0.30,
    ],

    // Qué categorías de food_items (ver su columna `category`) arman cada
    // comida -- "protein"/"carb" se dimensionan contra el objetivo de esa
    // comida, el resto (grasa/vegetal/fruta/lácteo) usa una porción fija
    // razonable (ver GenerateNutritionPlanAction::FIXED_PORTION_GRAMS)
    // salvo que la categoría sea justamente 'fat'.
    'meal_categories' => [
        'breakfast' => ['protein', 'carb', 'fruit'],
        'lunch' => ['protein', 'carb', 'vegetable'],
        'snack' => ['dairy', 'fruit'],
        'dinner' => ['protein', 'carb', 'vegetable'],
    ],
];
