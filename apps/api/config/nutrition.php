<?php

/**
 * Catálogo estático para NutritionTargetCalculator (Sprint 12). Mismo
 * criterio que config/rankings.php/config/onboarding.php: vive en config
 * porque todavía no cambia con frecuencia.
 */
// Esta línea sirve para devolver el arreglo de configuración de nutrición.
return [
    // Multiplicador de actividad (Mifflin-St Jeor) inferido de frequency_days
    // (días de entrenamiento/semana) — es la única señal de actividad que
    // existe en el schema hoy, no hay un campo de "nivel de actividad" propio.
    // Esta línea sirve para definir el multiplicador de actividad según los días de entrenamiento.
    'activity_multiplier_by_frequency' => [
        // Esta línea sirve para usar 1.375 (actividad ligera) con 3 días.
        3 => 1.375, // light
        // Esta línea sirve para usar 1.55 (actividad moderada) con 4 días.
        4 => 1.55,  // moderate
        // Esta línea sirve para usar 1.725 (activo) con 5 días.
        5 => 1.725, // active
        // Esta línea sirve para usar 1.9 (muy activo) con 6 días.
        6 => 1.9,   // very active
    ],

    // % de ajuste sobre TDEE según la meta primaria (primer elemento de
    // OnboardingResponse.goals, que es un array — ver nota en
    // NutritionTargetCalculator sobre por qué se usa solo el primero).
    // Esta línea sirve para definir el ajuste de calorías según el objetivo.
    'calorie_adjustment_by_goal' => [
        // Esta línea sirve para restar 20% para perder grasa.
        'lose_fat' => -0.20,
        // Esta línea sirve para restar 10% para cardio.
        'cardio' => -0.10,
        // Esta línea sirve para restar 5% para recomposición corporal.
        'body_recomposition' => -0.05,
        // Esta línea sirve para sumar 12% para ganar músculo.
        'gain_muscle' => 0.12,
        // Esta línea sirve para sumar 8% para fuerza.
        'strength' => 0.08,
        // Esta línea sirve para dejar igual para rendimiento deportivo.
        'sport_performance' => 0.0,
        // Esta línea sirve para dejar igual para resistencia.
        'endurance' => 0.0,
        // Esta línea sirve para dejar igual para salud.
        'health' => 0.0,
    ],

    // g de proteína por kg de peso corporal según meta primaria.
    // Esta línea sirve para definir los gramos de proteína por kilo según el objetivo.
    'protein_g_per_kg_by_goal' => [
        // Esta línea sirve para usar 2,2 g/kg para perder grasa.
        'lose_fat' => 2.2, // más alto en déficit, para preservar músculo
        // Esta línea sirve para usar 2,0 g/kg para ganar músculo.
        'gain_muscle' => 2.0,
        // Esta línea sirve para usar 2,0 g/kg para fuerza.
        'strength' => 2.0,
    ],
    // Esta línea sirve para usar 1,6 g/kg para los demás objetivos.
    'default_protein_g_per_kg' => 1.6,

    // Esta línea sirve para definir que la grasa aporta el 25% de las calorías.
    'fat_pct_of_calories' => 0.25,

    // Esta línea sirve para definir 35 ml de agua por kilo de peso.
    'water_ml_per_kg' => 35,
    // Esta línea sirve para sumar 500 ml de agua los días de entrenamiento.
    'water_ml_extra_on_training_day' => 500,

    // Plan alimenticio (GenerateNutritionPlanAction): reparte el objetivo
    // diario (de NutritionTargetCalculator) entre 4 comidas. Mismo % para
    // calorías y cada macro -- no hay razón nutricional para variar la
    // proporción de proteína/carbos/grasa entre comidas acá, mantenerlo
    // simple. Suman 1.0.
    // Esta línea sirve para definir cómo se reparte el objetivo diario entre las comidas.
    'meal_split_ratio' => [
        // Esta línea sirve para asignar el 25% al desayuno.
        'breakfast' => 0.25,
        // Esta línea sirve para asignar el 35% al almuerzo.
        'lunch' => 0.35,
        // Esta línea sirve para asignar el 10% al snack.
        'snack' => 0.10,
        // Esta línea sirve para asignar el 30% a la cena.
        'dinner' => 0.30,
    ],

    // Qué categorías de food_items (ver su columna `category`) arman cada
    // comida -- "protein"/"carb" se dimensionan contra el objetivo de esa
    // comida, el resto (grasa/vegetal/fruta/lácteo) usa una porción fija
    // razonable (ver GenerateNutritionPlanAction::FIXED_PORTION_GRAMS)
    // salvo que la categoría sea justamente 'fat'.
    // Esta línea sirve para definir qué categorías de alimentos arman cada comida.
    'meal_categories' => [
        // Esta línea sirve para armar el desayuno con proteína, carbohidrato y fruta.
        'breakfast' => ['protein', 'carb', 'fruit'],
        // Esta línea sirve para armar el almuerzo con proteína, carbohidrato y vegetal.
        'lunch' => ['protein', 'carb', 'vegetable'],
        // Esta línea sirve para armar el snack con lácteo y fruta.
        'snack' => ['dairy', 'fruit'],
        // Esta línea sirve para armar la cena con proteína, carbohidrato y vegetal.
        'dinner' => ['protein', 'carb', 'vegetable'],
    ],
];
