<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de nutrición.

namespace App\Domain\Nutrition\Services;

/**
 * Calorías/macros/agua objetivo (Sprint 12). Puro salvo por leer
 * config('nutrition.*') — mismo criterio que RankingScopeResolver, así que
 * como ese, sus tests tienen que extender Tests\TestCase (config() necesita
 * el framework arrancado), no PHPUnit\Framework\TestCase puro.
 */
// Esta línea sirve para declarar el servicio que calcula calorías, macros y agua objetivo.
final class NutritionTargetCalculator
{
    /**
     * @param  array<int, string>  $goals  OnboardingResponse.goals — se usa solo el primero como meta primaria, ver nota en config/nutrition.php.
     * @return array{calories: int, protein_g: int, carbs_g: int, fat_g: int, water_ml: int}
     */
    // Esta línea sirve para declarar el método que calcula los objetivos diarios.
    public function calculate(
        // Esta línea sirve para recibir la edad.
        int $age,
        // Esta línea sirve para recibir el sexo.
        string $sex,
        // Esta línea sirve para recibir el peso en kilos.
        float $weightKg,
        // Esta línea sirve para recibir la altura en centímetros.
        float $heightCm,
        // Esta línea sirve para recibir los días de entrenamiento por semana.
        int $frequencyDays,
        // Esta línea sirve para recibir los objetivos del usuario.
        array $goals,
        // Esta línea sirve para recibir si ya entrenó hoy.
        bool $trainedToday,
        // Esta línea sirve para indicar que el método devuelve un arreglo.
    ): array {
        // Esta línea sirve para calcular el metabolismo basal con la fórmula de Mifflin-St Jeor.
        $bmr = (10 * $weightKg) + (6.25 * $heightCm) - (5 * $age) + ($sex === 'male' ? 5 : -161);

        // Esta línea sirve para obtener el multiplicador de actividad según los días de entrenamiento.
        $multiplier = config("nutrition.activity_multiplier_by_frequency.{$frequencyDays}", 1.375);
        // Esta línea sirve para calcular el gasto calórico total del día.
        $tdee = $bmr * $multiplier;

        // Esta línea sirve para tomar el objetivo principal (el primero).
        $primaryGoal = $goals[0] ?? null;
        // Esta línea sirve para obtener el ajuste calórico de ese objetivo.
        $adjustmentPct = config("nutrition.calorie_adjustment_by_goal.{$primaryGoal}", 0.0);
        // Esta línea sirve para aplicar el ajuste a las calorías.
        $calories = $tdee * (1 + $adjustmentPct);

        // Esta línea sirve para obtener los gramos de proteína por kilo del objetivo (o el valor por defecto).
        $proteinGPerKg = config("nutrition.protein_g_per_kg_by_goal.{$primaryGoal}") ?? config('nutrition.default_protein_g_per_kg');
        // Esta línea sirve para calcular los gramos de proteína del día.
        $proteinG = $proteinGPerKg * $weightKg;

        // Esta línea sirve para calcular las calorías que deben venir de la grasa.
        $fatCalories = $calories * config('nutrition.fat_pct_of_calories');
        // Esta línea sirve para convertir esas calorías a gramos de grasa (9 kcal por gramo).
        $fatG = $fatCalories / 9;

        // Esta línea sirve para calcular las calorías que aporta la proteína (4 kcal por gramo).
        $proteinCalories = $proteinG * 4;
        // Esta línea sirve para calcular las calorías que quedan para los carbohidratos.
        $carbsCalories = max(0.0, $calories - $proteinCalories - $fatCalories);
        // Esta línea sirve para convertir esas calorías a gramos de carbohidratos (4 kcal por gramo).
        $carbsG = $carbsCalories / 4;

        // Esta línea sirve para calcular el agua según el peso.
        $waterMl = ($weightKg * config('nutrition.water_ml_per_kg'))
            // Esta línea sirve para sumar agua extra si hoy entrenó.
            + ($trainedToday ? config('nutrition.water_ml_extra_on_training_day') : 0);

        // Esta línea sirve para devolver los objetivos redondeados.
        return [
            // Esta línea sirve para incluir las calorías.
            'calories' => (int) round($calories),
            // Esta línea sirve para incluir los gramos de proteína.
            'protein_g' => (int) round($proteinG),
            // Esta línea sirve para incluir los gramos de carbohidratos.
            'carbs_g' => (int) round($carbsG),
            // Esta línea sirve para incluir los gramos de grasa.
            'fat_g' => (int) round($fatG),
            // Esta línea sirve para incluir los mililitros de agua.
            'water_ml' => (int) round($waterMl),
        ];
    }
}
