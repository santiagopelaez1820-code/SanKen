<?php

namespace Tests\Unit\Domain\Workout;

use App\Domain\Workout\Services\SessionReadinessAdjuster;
use PHPUnit\Framework\TestCase;

class SessionReadinessAdjusterTest extends TestCase
{
    public function test_no_precheck_answers_means_no_adjustment(): void
    {
        $adjuster = new SessionReadinessAdjuster;

        $adjustment = $adjuster->adjustmentFor([], 'beginner');

        $this->assertTrue($adjustment->isNeutral());
        $this->assertNull($adjustment->note);
    }

    public function test_good_precheck_answers_mean_no_adjustment_regardless_of_level(): void
    {
        $adjuster = new SessionReadinessAdjuster;

        $adjustment = $adjuster->adjustmentFor(
            ['sleep_quality' => 5, 'energy_level' => 4, 'muscle_soreness' => 1],
            'advanced',
        );

        $this->assertTrue($adjustment->isNeutral());
    }

    public function test_a_single_low_signal_still_trims_a_beginner_but_barely_touches_an_advanced_user(): void
    {
        $adjuster = new SessionReadinessAdjuster;
        $precheck = ['sleep_quality' => 2, 'energy_level' => 4, 'muscle_soreness' => 2];

        $beginner = $adjuster->adjustmentFor($precheck, 'beginner');
        $advanced = $adjuster->adjustmentFor($precheck, 'advanced');

        $this->assertSame(-1, $beginner->setsDelta);
        $this->assertSame(0.90, $beginner->weightMultiplier);
        $this->assertNotNull($beginner->note);

        $this->assertSame(0, $advanced->setsDelta);
        $this->assertSame(0.95, $advanced->weightMultiplier);
    }

    public function test_two_or_more_low_signals_trim_every_level_but_advanced_less_than_beginner(): void
    {
        $adjuster = new SessionReadinessAdjuster;
        $precheck = ['sleep_quality' => 1, 'energy_level' => 2, 'muscle_soreness' => 5];

        $beginner = $adjuster->adjustmentFor($precheck, 'beginner');
        $intermediate = $adjuster->adjustmentFor($precheck, 'intermediate');
        $advanced = $adjuster->adjustmentFor($precheck, 'advanced');

        $this->assertSame(-1, $beginner->setsDelta);
        $this->assertSame(0.80, $beginner->weightMultiplier);

        $this->assertSame(-1, $intermediate->setsDelta);
        $this->assertSame(0.85, $intermediate->weightMultiplier);

        $this->assertSame(-1, $advanced->setsDelta);
        $this->assertSame(0.90, $advanced->weightMultiplier);
    }

    public function test_note_names_the_specific_reasons_that_triggered(): void
    {
        $adjuster = new SessionReadinessAdjuster;

        $note = $adjuster->adjustmentFor(['sleep_quality' => 1], 'intermediate')->note;

        $this->assertStringContainsString('dormiste poco', $note);
        $this->assertStringNotContainsString('energía', $note);
        $this->assertStringNotContainsString('dolor muscular', $note);
    }

    public function test_apply_sets_never_goes_below_one(): void
    {
        $adjuster = new SessionReadinessAdjuster;
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        $this->assertSame(1, $adjuster->applySets(1, $adjustment));
        $this->assertSame(2, $adjuster->applySets(3, $adjustment));
    }

    public function test_apply_reps_per_set_truncates_to_the_new_set_count(): void
    {
        $adjuster = new SessionReadinessAdjuster;
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        $this->assertSame([10, 10], $adjuster->applyRepsPerSet([10, 10, 12], 2));
        $this->assertNull($adjuster->applyRepsPerSet(null, 2));
    }

    public function test_apply_weight_and_rpe_respect_nulls_and_the_rpe_floor(): void
    {
        $adjuster = new SessionReadinessAdjuster;
        $adjustment = $adjuster->adjustmentFor(['sleep_quality' => 1, 'energy_level' => 1], 'beginner');

        $this->assertSame(80.0, $adjuster->applyWeight(100.0, $adjustment));
        $this->assertNull($adjuster->applyWeight(null, $adjustment));

        $this->assertSame(5.0, $adjuster->applyRpe(6.0, $adjustment));
        $this->assertNull($adjuster->applyRpe(null, $adjustment));
    }
}
