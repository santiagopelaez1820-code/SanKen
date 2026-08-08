<?php

namespace Tests\Unit\Domain\Stats;

use App\Domain\Stats\Services\StreakCalculator;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

class StreakCalculatorTest extends TestCase
{
    public function test_no_workouts_means_no_streak(): void
    {
        $calc = new StreakCalculator;

        $this->assertSame(0, $calc->calculate([], CarbonImmutable::parse('2026-08-06')));
    }

    public function test_counts_consecutive_days_ending_today(): void
    {
        $calc = new StreakCalculator;

        $streak = $calc->calculate(
            ['2026-08-04', '2026-08-05', '2026-08-06'],
            CarbonImmutable::parse('2026-08-06'),
        );

        $this->assertSame(3, $streak);
    }

    public function test_tolerates_one_rest_day_before_today(): void
    {
        $calc = new StreakCalculator;

        // Entrenó ayer, hoy todavía no — la racha sigue viva.
        $streak = $calc->calculate(
            ['2026-08-03', '2026-08-04', '2026-08-05'],
            CarbonImmutable::parse('2026-08-06'),
        );

        $this->assertSame(3, $streak);
    }

    public function test_breaks_after_a_two_day_gap(): void
    {
        $calc = new StreakCalculator;

        $streak = $calc->calculate(
            ['2026-08-01', '2026-08-02'],
            CarbonImmutable::parse('2026-08-06'),
        );

        $this->assertSame(0, $streak);
    }

    public function test_stops_counting_at_the_first_gap_in_the_middle(): void
    {
        $calc = new StreakCalculator;

        // 08-06 y 08-05 consecutivos, pero 08-03 deja un hueco antes de esos dos.
        $streak = $calc->calculate(
            ['2026-08-03', '2026-08-05', '2026-08-06'],
            CarbonImmutable::parse('2026-08-06'),
        );

        $this->assertSame(2, $streak);
    }

    public function test_ignores_duplicate_dates(): void
    {
        $calc = new StreakCalculator;

        $streak = $calc->calculate(
            ['2026-08-06', '2026-08-06', '2026-08-05'],
            CarbonImmutable::parse('2026-08-06'),
        );

        $this->assertSame(2, $streak);
    }
}
