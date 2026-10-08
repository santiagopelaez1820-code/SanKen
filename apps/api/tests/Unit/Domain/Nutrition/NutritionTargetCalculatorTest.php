<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Nutrition.

namespace Tests\Unit\Domain\Nutrition;

// Esta línea sirve para importar la clase NutritionTargetCalculator.
use App\Domain\Nutrition\Services\NutritionTargetCalculator;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * A diferencia de XpLevelCalculatorTest (PHPUnit\Framework\TestCase puro),
 * este calculador lee config('nutrition.*'), así que necesita la app de
 * Laravel arrancada — sin RefreshDatabase, no toca la base de datos. Mismo
 * criterio que RankingScopeResolverTest.
 */
// Esta línea sirve para declarar la clase de tests NutritionTargetCalculatorTest.
class NutritionTargetCalculatorTest extends TestCase
{
    // Esta línea sirve para guardar el calculador de objetivos.
    private NutritionTargetCalculator $calculator;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para crear el calculador.
        $this->calculator = new NutritionTargetCalculator;
    }

    // Esta línea sirve para declarar el test que comprueba el cálculo de calorías para un hombre que quiere ganar músculo.
    public function test_calculates_bmr_tdee_and_calorie_target_for_a_male_gaining_muscle(): void
    {
        // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
        // TDEE (4 días/sem -> x1.55) = 1780 * 1.55 = 2759
        // +12% (gain_muscle) = 2759 * 1.12 = 3090.08 -> redondeado 3090
        // Esta línea sirve para calcular los objetivos.
        $result = $this->calculator->calculate(
            // Esta línea sirve para pasar la edad.
            age: 30,
            // Esta línea sirve para pasar el sexo.
            sex: 'male',
            // Esta línea sirve para pasar el peso.
            weightKg: 80,
            // Esta línea sirve para pasar la altura.
            heightCm: 180,
            // Esta línea sirve para pasar los días de entrenamiento.
            frequencyDays: 4,
            // Esta línea sirve para pasar el objetivo.
            goals: ['gain_muscle'],
            // Esta línea sirve para indicar que hoy no entrenó.
            trainedToday: false,
        );

        // Esta línea sirve para exigir que las calorías sean 3090.
        $this->assertSame(3090, $result['calories']);
    }

    // Esta línea sirve para declarar el test que comprueba que el cálculo para mujeres usa el ajuste de -161.
    public function test_female_bmr_uses_the_161_offset(): void
    {
        // BMR = 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
        // Esta línea sirve para calcular los objetivos de un hombre.
        $resultMale = $this->calculator->calculate(30, 'male', 60, 165, 3, [], false);
        // Esta línea sirve para calcular los objetivos de una mujer.
        $resultFemale = $this->calculator->calculate(30, 'female', 60, 165, 3, [], false);

        // Esta línea sirve para exigir que las calorías de la mujer sean menores.
        $this->assertLessThan($resultMale['calories'], $resultFemale['calories']);
    }

    // Esta línea sirve para declarar el test que comprueba que perder grasa baja las calorías respecto al mantenimiento.
    public function test_lose_fat_goal_reduces_calories_below_tdee(): void
    {
        // Esta línea sirve para calcular las calorías de mantenimiento.
        $maintenance = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);
        // Esta línea sirve para calcular las calorías para perder grasa.
        $cutting = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat'], false);

        // Esta línea sirve para exigir que sean menores que en mantenimiento.
        $this->assertLessThan($maintenance['calories'], $cutting['calories']);
    }

    // Esta línea sirve para declarar el test que comprueba que solo se usa el primer objetivo como principal.
    public function test_only_the_first_goal_is_used_as_primary(): void
    {
        // Esta línea sirve para calcular con "ganar músculo" primero.
        $gainMuscleFirst = $this->calculator->calculate(30, 'male', 80, 180, 4, ['gain_muscle', 'lose_fat'], false);
        // Esta línea sirve para calcular con "perder grasa" primero.
        $loseFatFirst = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat', 'gain_muscle'], false);

        // Esta línea sirve para exigir que ganar músculo dé más calorías.
        $this->assertGreaterThan($loseFatFirst['calories'], $gainMuscleFirst['calories']);
    }

    // Esta línea sirve para declarar el test que comprueba que la proteína por kilo es mayor al definir que por defecto.
    public function test_protein_target_is_higher_per_kg_when_cutting_than_default(): void
    {
        // Esta línea sirve para calcular para perder grasa.
        $cutting = $this->calculator->calculate(30, 'male', 80, 180, 4, ['lose_fat'], false);
        // Esta línea sirve para calcular sin objetivo.
        $noGoal = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);

        // lose_fat -> 2.2g/kg * 80 = 176; sin meta -> default 1.6g/kg * 80 = 128
        // Esta línea sirve para exigir 176 g de proteína al definir.
        $this->assertSame(176, $cutting['protein_g']);
        // Esta línea sirve para exigir 128 g de proteína por defecto.
        $this->assertSame(128, $noGoal['protein_g']);
    }

    // Esta línea sirve para declarar el test que comprueba que los carbohidratos nunca son negativos.
    public function test_carbs_never_go_negative_even_with_a_large_deficit_and_high_protein(): void
    {
        // Esta línea sirve para calcular con un déficit grande y mucha proteína.
        $result = $this->calculator->calculate(60, 'female', 45, 150, 3, ['lose_fat'], false);

        // Esta línea sirve para exigir que los carbohidratos sean 0 o más.
        $this->assertGreaterThanOrEqual(0, $result['carbs_g']);
    }

    // Esta línea sirve para declarar el test que comprueba que el agua incluye un extra en día de entrenamiento.
    public function test_water_target_includes_extra_on_a_training_day(): void
    {
        // Esta línea sirve para calcular un día de descanso.
        $restDay = $this->calculator->calculate(30, 'male', 80, 180, 4, [], false);
        // Esta línea sirve para calcular un día de entrenamiento.
        $trainingDay = $this->calculator->calculate(30, 'male', 80, 180, 4, [], true);

        // 35ml/kg * 80 = 2800; +500 en día de entrenamiento
        // Esta línea sirve para exigir 2800 ml en descanso.
        $this->assertSame(2800, $restDay['water_ml']);
        // Esta línea sirve para exigir 3300 ml entrenando.
        $this->assertSame(3300, $trainingDay['water_ml']);
    }

    // Esta línea sirve para declarar el test que comprueba que una frecuencia desconocida usa el multiplicador más bajo.
    public function test_unknown_frequency_falls_back_to_the_lightest_activity_multiplier(): void
    {
        // Esta línea sirve para calcular con una frecuencia desconocida.
        $result = $this->calculator->calculate(30, 'male', 80, 180, 99, [], false);

        // BMR=1780, fallback x1.375 = 2447.5 -> 2448
        // Esta línea sirve para exigir 2448 calorías.
        $this->assertSame(2448, $result['calories']);
    }
}
