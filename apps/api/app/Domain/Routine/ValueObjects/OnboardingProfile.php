<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Snapshot inmutable de las respuestas de onboarding relevantes para generar
 * una rutina. El dominio no conoce Eloquent: la Application layer construye
 * esto a partir de User/UserProfile/OnboardingResponse.
 */
final readonly class OnboardingProfile
{
    /**
     * @param  string[]  $goals
     * @param  string[]  $equipmentAvailable
     * @param  string[]  $injuries
     */
    public function __construct(
        public string $level,
        public array $goals,
        public int $frequencyDays,
        public int $sessionMinutes,
        public string $place,
        public array $equipmentAvailable,
        public array $injuries,
    ) {}

    public function primaryGoal(): string
    {
        return $this->goals[0] ?? 'health';
    }
}
