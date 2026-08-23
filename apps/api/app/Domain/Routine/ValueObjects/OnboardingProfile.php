<?php

namespace App\Domain\Routine\ValueObjects;

/**
 * Snapshot inmutable de las respuestas de onboarding relevantes para generar
 * una rutina. El dominio no conoce Eloquent: la Application layer construye
 * esto a partir de User/UserProfile/OnboardingResponse.
 *
 * `sessionMinutes`/`place`/`injuries` solo las usa el motor algorítmico viejo
 * (`RoutineGenerator`/`ExerciseSelector`, ya no es el camino activo — ver
 * `TemplateRoutineGenerator`); quedan opcionales con default para no romper
 * ese código ni sus tests, aunque el onboarding ya no recolecta esas 3
 * preguntas. `sex` es nuevo: lo usa el motor de plantillas para elegir la
 * combinación sexo+frecuencia correcta.
 *
 * @param  string[]  $goals
 * @param  string[]  $equipmentAvailable
 * @param  string[]  $injuries
 */
final readonly class OnboardingProfile
{
    public function __construct(
        public string $level,
        public array $goals,
        public int $frequencyDays,
        public array $equipmentAvailable,
        public string $sex = 'male',
        public int $sessionMinutes = 45,
        public string $place = 'gym',
        public array $injuries = [],
    ) {}

    public function primaryGoal(): string
    {
        return $this->goals[0] ?? 'health';
    }
}
