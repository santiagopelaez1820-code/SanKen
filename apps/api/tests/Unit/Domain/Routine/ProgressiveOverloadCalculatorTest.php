<?php

namespace Tests\Unit\Domain\Routine;

use App\Domain\Routine\Services\ProgressiveOverloadCalculator;
use App\Domain\Routine\ValueObjects\PerformanceSummary;
use PHPUnit\Framework\TestCase;

class ProgressiveOverloadCalculatorTest extends TestCase
{
    private function performance(array $overrides = []): PerformanceSummary
    {
        return new PerformanceSummary(
            targetSets: $overrides['targetSets'] ?? 3,
            targetRepsMin: $overrides['targetRepsMin'] ?? 8,
            actualSets: $overrides['actualSets'] ?? 3,
            averageReps: $overrides['averageReps'] ?? 10,
            topWeightUsed: $overrides['topWeightUsed'] ?? 100,
            completedAsPlanned: $overrides['completedAsPlanned'] ?? true,
        );
    }

    public function test_matches_the_documented_week_over_week_progression_example(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $week2 = $calc->calculate($this->performance(['topWeightUsed' => 100]), 'barbell', 0);
        $this->assertSame(102.5, $week2->suggestedWeightKg);
        $this->assertTrue($week2->succeeded);

        $week3 = $calc->calculate($this->performance(['topWeightUsed' => 102.5]), 'barbell', 0);
        $this->assertSame(105.0, $week3->suggestedWeightKg);
    }

    public function test_maintains_weight_on_first_failure(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance(['actualSets' => 2, 'topWeightUsed' => 100]),
            'barbell',
            0,
        );

        $this->assertSame(100.0, $result->suggestedWeightKg);
        $this->assertFalse($result->succeeded);
        $this->assertFalse($result->deloaded);
        $this->assertSame(1, $result->consecutiveFailures);
    }

    public function test_deloads_after_two_consecutive_failures(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance(['actualSets' => 2, 'topWeightUsed' => 100]),
            'barbell',
            1,
        );

        $this->assertSame(90.0, $result->suggestedWeightKg);
        $this->assertTrue($result->deloaded);
        $this->assertSame(0, $result->consecutiveFailures);
    }

    public function test_never_increases_weight_when_user_reports_they_could_not_complete_it(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        // Sobre el papel completó series y reps, pero respondió "No" al feedback:
        // la regla de negocio manda sobre los números.
        $result = $calc->calculate(
            $this->performance(['completedAsPlanned' => false, 'topWeightUsed' => 100]),
            'barbell',
            0,
        );

        $this->assertLessThanOrEqual(100.0, $result->suggestedWeightKg);
        $this->assertFalse($result->succeeded);
    }

    public function test_uses_smaller_increments_for_dumbbells_than_barbells(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $barbell = $calc->calculate($this->performance(['topWeightUsed' => 20]), 'barbell', 0);
        $dumbbell = $calc->calculate($this->performance(['topWeightUsed' => 20]), 'dumbbells', 0);

        $this->assertSame(22.5, $barbell->suggestedWeightKg);
        $this->assertSame(21.0, $dumbbell->suggestedWeightKg);
    }

    public function test_bodyweight_exercises_never_suggest_a_weight(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate($this->performance(['topWeightUsed' => 0]), 'bodyweight_only', 0);

        $this->assertSame(0.0, $result->suggestedWeightKg);
    }
}
