<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Unit\Domain\Stats.

namespace Tests\Unit\Domain\Stats;

// Esta línea sirve para importar la clase StreakCalculator.
use App\Domain\Stats\Services\StreakCalculator;
// Esta línea sirve para importar la clase CarbonImmutable.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar la clase TestCase.
use PHPUnit\Framework\TestCase;

// Esta línea sirve para declarar la clase de tests StreakCalculatorTest.
class StreakCalculatorTest extends TestCase
{
    // Esta línea sirve para declarar el test que comprueba que sin entrenamientos no hay racha.
    public function test_no_workouts_means_no_streak(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // Esta línea sirve para exigir que la racha sea 0.
        $this->assertSame(0, $calc->calculate([], CarbonImmutable::parse('2026-08-06')));
    }

    // Esta línea sirve para declarar el test que comprueba que cuenta días consecutivos hasta hoy.
    public function test_counts_consecutive_days_ending_today(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // Esta línea sirve para calcular la racha.
        $streak = $calc->calculate(
            // Esta línea sirve para pasar tres días seguidos que terminan hoy.
            ['2026-08-04', '2026-08-05', '2026-08-06'],
            // Esta línea sirve para indicar que hoy es el 6 de agosto.
            CarbonImmutable::parse('2026-08-06'),
        );

        // Esta línea sirve para exigir que la racha sea 3.
        $this->assertSame(3, $streak);
    }

    // Esta línea sirve para declarar el test que comprueba que tolera un día de descanso antes de hoy.
    public function test_tolerates_one_rest_day_before_today(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // Entrenó ayer, hoy todavía no — la racha sigue viva.
        // Esta línea sirve para calcular la racha.
        $streak = $calc->calculate(
            // Esta línea sirve para pasar tres días seguidos que terminan ayer.
            ['2026-08-03', '2026-08-04', '2026-08-05'],
            // Esta línea sirve para indicar que hoy es el 6 de agosto.
            CarbonImmutable::parse('2026-08-06'),
        );

        // Esta línea sirve para exigir que la racha sea 3.
        $this->assertSame(3, $streak);
    }

    // Esta línea sirve para declarar el test que comprueba que la racha se rompe tras dos días sin entrenar.
    public function test_breaks_after_a_two_day_gap(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // Esta línea sirve para calcular la racha.
        $streak = $calc->calculate(
            // Esta línea sirve para pasar dos días de hace varios días.
            ['2026-08-01', '2026-08-02'],
            // Esta línea sirve para indicar que hoy es el 6 de agosto.
            CarbonImmutable::parse('2026-08-06'),
        );

        // Esta línea sirve para exigir que la racha sea 0.
        $this->assertSame(0, $streak);
    }

    // Esta línea sirve para declarar el test que comprueba que deja de contar en el primer hueco del medio.
    public function test_stops_counting_at_the_first_gap_in_the_middle(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // 08-06 y 08-05 consecutivos, pero 08-03 deja un hueco antes de esos dos.
        // Esta línea sirve para calcular la racha.
        $streak = $calc->calculate(
            // Esta línea sirve para pasar fechas con un hueco en el medio.
            ['2026-08-03', '2026-08-05', '2026-08-06'],
            // Esta línea sirve para indicar que hoy es el 6 de agosto.
            CarbonImmutable::parse('2026-08-06'),
        );

        // Esta línea sirve para exigir que la racha sea 2.
        $this->assertSame(2, $streak);
    }

    // Esta línea sirve para declarar el test que comprueba que ignora las fechas repetidas.
    public function test_ignores_duplicate_dates(): void
    {
        // Esta línea sirve para crear el calculador.
        $calc = new StreakCalculator;

        // Esta línea sirve para calcular la racha.
        $streak = $calc->calculate(
            // Esta línea sirve para pasar fechas con un día repetido.
            ['2026-08-06', '2026-08-06', '2026-08-05'],
            // Esta línea sirve para indicar que hoy es el 6 de agosto.
            CarbonImmutable::parse('2026-08-06'),
        );

        // Esta línea sirve para exigir que la racha sea 2.
        $this->assertSame(2, $streak);
    }
}
