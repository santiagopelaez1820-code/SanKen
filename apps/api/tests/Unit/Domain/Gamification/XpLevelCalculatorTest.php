<?php

namespace Tests\Unit\Domain\Gamification;

use App\Domain\Gamification\Services\XpLevelCalculator;
use PHPUnit\Framework\TestCase;

class XpLevelCalculatorTest extends TestCase
{
    public function test_level_at_xp_boundaries(): void
    {
        $calc = new XpLevelCalculator;

        $this->assertSame(1, $calc->level(0));
        $this->assertSame(1, $calc->level(99));
        $this->assertSame(2, $calc->level(100));
        $this->assertSame(2, $calc->level(399));
        $this->assertSame(3, $calc->level(400));
        $this->assertSame(4, $calc->level(900));
        $this->assertSame(5, $calc->level(1600));
    }

    public function test_xp_for_level(): void
    {
        $calc = new XpLevelCalculator;

        $this->assertSame(0, $calc->xpForLevel(1));
        $this->assertSame(100, $calc->xpForLevel(2));
        $this->assertSame(400, $calc->xpForLevel(3));
        $this->assertSame(900, $calc->xpForLevel(4));
        $this->assertSame(1600, $calc->xpForLevel(5));
    }

    public function test_progress_reports_level_and_percent_towards_next(): void
    {
        $calc = new XpLevelCalculator;

        $progress = $calc->progress(150);

        $this->assertSame(2, $progress['level']);
        $this->assertSame(100, $progress['xp_for_current_level']);
        $this->assertSame(400, $progress['xp_for_next_level']);
        $this->assertEqualsWithDelta(50 / 300, $progress['progress_pct'], 0.0001);
    }

    public function test_progress_at_exact_level_boundary_is_zero_pct(): void
    {
        $calc = new XpLevelCalculator;

        $progress = $calc->progress(400);

        $this->assertSame(3, $progress['level']);
        $this->assertSame(0.0, $progress['progress_pct']);
    }
}
