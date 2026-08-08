<?php

namespace App\Domain\Routine\Contracts;

use App\Domain\Routine\ValueObjects\ExerciseData;
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
use App\Domain\Routine\ValueObjects\OnboardingProfile;

interface RoutineGeneratorInterface
{
    /**
     * @param  ExerciseData[]  $exercisePool
     */
    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine;
}
