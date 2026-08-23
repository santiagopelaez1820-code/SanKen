<?php

namespace Tests\Unit\Domain\Nutrition;

use App\Domain\Nutrition\Services\NutritionTargetCalculator;
use Tests\TestCase;

/**
 * A diferencia de XpLevelCalculatorTest (PHPUnit\Framework\TestCase puro),
 * este calculador lee config('nutrition.*'), así que necesita la app de
 * Laravel arrancada — sin RefreshDatabase, no toca la base de datos. Mismo
 * criterio que RankingScopeResolverTest.
 */
class NutritionTargetCalculatorTest extends TestCase
{
    private NutritionTargetCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new NutritionTargetCalculator;
    }

    public function test_calculates_bmr_tdee_and_calorie_target_for_a_male_gaining_muscle(): void
    {
        // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
        // TDEE (4 días/sem -> x1.55) = 1780 * 1.55 = 2759
        // +12% (gain_muscle) = 2759 * 1.12 = 3090.08 -> redondeado 3090
        $result = $this->calculator->calculate(
            age: 30,
            sex: 'male',
            weightKg: 80,
            heightCm: 180,
            frequencyDays: 4,
            goals: ['gain_muscle'],
            trainedToday: false,
        );

        $this->assertSame(3090, $result['calories']);
    }

    public function test_female_bmr_uses_the_161_offset(): void
    {
        // BMR = 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
        $resultMale = $this->calculator->calculate(30, 'male', 60, 165, 3, [], false);
        $resultFemale = $this->calculator->calculate(30, 'female', 60, 165, 3, [], false);

        $this->assertLessThan($resultMale['calories'], $resultFemale['calories']);
    }

    public function test_lose_fat_goal_reduces_calories_below_tdee(): void
    {
        $maintenance = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);
        $cutting = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat'], false);

        $this->assertLessThan($maintenance['calories'], $cutting['calories']);
    }

    public function test_only_the_first_goal_is_used_as_primary(): void
    {
        $gainMuscleFirst = $this->calculator->calculate(30, 'male', 80, 180, 4, ['gain_muscle', 'lose_fat'], false);
        $loseFatFirst = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat', 'gain_muscle'], false);

        $this->assertGreaterThan($loseFatFirst['calories'], $gainMuscleFirst['calories']);
    }

    public function test_protein_target_is_higher_per_kg_when_cutting_than_default(): void
    {
        $cutting = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat'], false);
        $noGoal = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);

        // lose_fat -> 2.2g/kg * 80 = 176; sin meta -> default 1.6g/kg * 80 = 128
        $this->assertSame(176, $cutting['protein_g']);
        $this->assertSame(128, $noGoal['protein_g']);
    }

    public function test_carbs_never_go_negative_even_with_a_large_deficit_and_high_protein(): void
    {
        $result = $this->calculator->calculate(60, 'female', 45, 150, 3, ['lose_fat'], false);

        $this->assertGreaterThanOrEqual(0, $result['carbs_g']);
    }

    public function test_water_target_includes_extra_on_a_training_day(): void
    {
        $restDay = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);
        $trainingDay = $this->calculator->calculate(30, 'male', 80, 180, 4, [], true);

        // 35ml/kg * 80 = 2800; +500 en día de entrenamiento
        $this->assertSame(2800, $restDay['water_ml']);
        $this->assertSame(3300, $trainingDay['water_ml']);
    }

    public function test_unknown_frequency_falls_back_to_the_lightest_activity_multiplier(): void
    {
        $result = $this->calculator->calculate(30, 'male', 80, 180, 99, [], false);

        // BMR=1780, fallback x1.375 = 2447.5 -> 2448
        $this->assertSame(2448, $result['calories']);
    }
}
