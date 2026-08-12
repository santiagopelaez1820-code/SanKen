<?php

namespace App\Domain\Nutrition\Services;

/**
 * Calorías/macros/agua objetivo (Sprint 12). Puro salvo por leer
 * config('nutrition.*') — mismo criterio que RankingScopeResolver, así que
 * como ese, sus tests tienen que extender Tests\TestCase (config() necesita
 * el framework arrancado), no PHPUnit\Framework\TestCase puro.
 */
final class NutritionTargetCalculator
{
    /**
     * @param  array<int, string>  $goals  OnboardingResponse.goals — se usa solo el primero como meta primaria, ver nota en config/nutrition.php.
     * @return array{calories: int, protein_g: int, carbs_g: int, fat_g: int, water_ml: int}
     */
    public function calculate(
        int $age,
        string $sex,
        float $weightKg,
        float $heightCm,
        int $frequencyDays,
        array $goals,
        bool $trainedToday,
    ): array {
        $bmr = (10 * $weightKg) + (6.25 * $heightCm) - (5 * $age) + ($sex === 'male' ? 5 : -161);

        $multiplier = config("nutrition.activity_multiplier_by_frequency.{$frequencyDays}", 1.375);
        $tdee = $bmr * $multiplier;

        $primaryGoal = $goals[0] ?? null;
        $adjustmentPct = config("nutrition.calorie_adjustment_by_goal.{$primaryGoal}", 0.0);
        $calories = $tdee * (1 + $adjustmentPct);

        $proteinGPerKg = config("nutrition.protein_g_per_kg_by_goal.{$primaryGoal}") ?? config('nutrition.default_protein_g_per_kg');
        $proteinG = $proteinGPerKg * $weightKg;

        $fatCalories = $calories * config('nutrition.fat_pct_of_calories');
        $fatG = $fatCalories / 9;

        $proteinCalories = $proteinG * 4;
        $carbsCalories = max(0.0, $calories - $proteinCalories - $fatCalories);
        $carbsG = $carbsCalories / 4;

        $waterMl = ($weightKg * config('nutrition.water_ml_per_kg'))
            + ($trainedToday ? config('nutrition.water_ml_extra_on_training_day') : 0);

        return [
            'calories' => (int) round($calories),
            'protein_g' => (int) round($proteinG),
            'carbs_g' => (int) round($carbsG),
            'fat_g' => (int) round($fatG),
            'water_ml' => (int) round($waterMl),
        ];
    }
}
