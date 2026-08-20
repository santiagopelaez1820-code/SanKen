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
            actualRepsPerSet: $overrides['actualRepsPerSet'] ?? [10, 9, 9],
            actualWeightPerSet: $overrides['actualWeightPerSet'] ?? [100.0, 100.0, 100.0],
            targetRepsPerSet: $overrides['targetRepsPerSet'] ?? null,
            completedAsPlanned: $overrides['completedAsPlanned'] ?? true,
        );
    }

    public function test_matches_the_documented_reps_ramp_example(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        // Sin objetivo previo: 20kg, 10/9/9 reales -> siguiente objetivo 11/10/10, mismo peso.
        $result = $calc->calculate(
            $this->performance(['actualRepsPerSet' => [10, 9, 9], 'actualWeightPerSet' => [20.0, 20.0, 20.0]]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertSame(20.0, $result->suggestedWeightKg);
        $this->assertSame([11, 10, 10], $result->suggestedRepsPerSet);
        $this->assertTrue($result->succeeded);
        $this->assertFalse($result->weightIncreased);
    }

    public function test_ramps_reps_further_when_the_prior_target_is_met_again(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [11, 10, 10],
                'actualRepsPerSet' => [11, 10, 10],
                'actualWeightPerSet' => [20.0, 20.0, 20.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertSame([12, 11, 11], $result->suggestedRepsPerSet);
        $this->assertSame(20.0, $result->suggestedWeightKg);
        $this->assertFalse($result->weightIncreased);
    }

    public function test_exceeding_the_target_still_only_ramps_by_one_from_the_actual(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [8, 8, 8],
                'actualRepsPerSet' => [10, 9, 9],
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertSame([11, 10, 10], $result->suggestedRepsPerSet);
    }

    public function test_weight_only_increases_once_the_ceiling_was_already_the_target_and_gets_met_again(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [12, 12, 12],
                'actualRepsPerSet' => [12, 12, 12],
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertSame(102.5, $result->suggestedWeightKg);
        $this->assertTrue($result->weightIncreased);
        // Las reps vuelven al piso del rango original al subir de peso.
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    public function test_reps_never_ramp_past_the_ceiling_of_twelve(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [11, 11, 11],
                'actualRepsPerSet' => [15, 12, 20],
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertSame([12, 12, 12], $result->suggestedRepsPerSet);
        $this->assertFalse($result->weightIncreased);
    }

    public function test_holds_the_same_target_without_deloading_when_a_set_falls_short(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [8, 8, 8],
                'actualRepsPerSet' => [7, 8, 8],
                'actualWeightPerSet' => [100.0, 100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertFalse($result->succeeded);
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
        $this->assertSame(100.0, $result->suggestedWeightKg);
        $this->assertSame(1, $result->consecutiveFailures);
    }

    public function test_holds_when_fewer_sets_were_completed_than_the_target(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [8, 8, 8],
                'actualRepsPerSet' => [10, 9],
                'actualWeightPerSet' => [100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertFalse($result->succeeded);
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    public function test_first_attempt_ever_that_falls_short_starts_the_ramp_at_the_original_floor(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        // Primera vez con este ejercicio (sin objetivo previo) y no llega a
        // completar las 3 series -- no hay "objetivo previo" que sostener,
        // así que el próximo objetivo arranca en el piso del rango original.
        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => null,
                'actualRepsPerSet' => [10, 9],
                'actualWeightPerSet' => [100.0, 100.0],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertFalse($result->succeeded);
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
        $this->assertSame(100.0, $result->suggestedWeightKg);
    }

    public function test_consecutive_failures_keep_incrementing_without_ever_deloading(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance(['targetRepsPerSet' => [8, 8, 8], 'actualRepsPerSet' => [7, 7, 7]]),
            'barbell',
            5,
            floorReps: 8,
        );

        $this->assertSame(6, $result->consecutiveFailures);
        $this->assertSame(100.0, $result->suggestedWeightKg);
    }

    public function test_never_advances_when_the_user_reports_they_could_not_complete_it_as_planned(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        // Sobre el papel completó series y reps, pero respondió "No" al feedback:
        // la regla de negocio manda sobre los números.
        $result = $calc->calculate(
            $this->performance([
                'completedAsPlanned' => false,
                'targetRepsPerSet' => [8, 8, 8],
                'actualRepsPerSet' => [10, 10, 10],
            ]),
            'barbell',
            0,
            floorReps: 8,
        );

        $this->assertFalse($result->succeeded);
        $this->assertSame([8, 8, 8], $result->suggestedRepsPerSet);
    }

    public function test_uses_smaller_increments_for_dumbbells_than_barbells(): void
    {
        $calc = new ProgressiveOverloadCalculator;
        $atCeiling = ['targetRepsPerSet' => [12, 12, 12], 'actualRepsPerSet' => [12, 12, 12], 'actualWeightPerSet' => [20.0, 20.0, 20.0]];

        $barbell = $calc->calculate($this->performance($atCeiling), 'barbell', 0, floorReps: 8);
        $dumbbell = $calc->calculate($this->performance($atCeiling), 'dumbbells', 0, floorReps: 8);

        $this->assertSame(22.5, $barbell->suggestedWeightKg);
        $this->assertSame(21.0, $dumbbell->suggestedWeightKg);
    }

    public function test_bodyweight_exercises_never_suggest_a_weight(): void
    {
        $calc = new ProgressiveOverloadCalculator;

        $result = $calc->calculate(
            $this->performance([
                'targetRepsPerSet' => [12, 12, 12],
                'actualRepsPerSet' => [12, 12, 12],
                'actualWeightPerSet' => [0.0, 0.0, 0.0],
            ]),
            'bodyweight_only',
            0,
            floorReps: 8,
        );

        $this->assertSame(0.0, $result->suggestedWeightKg);
    }
}
