<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

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
// Esta línea sirve para declarar el objeto con el perfil del onboarding para el motor.
final readonly class OnboardingProfile
{
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar el nivel.
        public string $level,
        // Esta línea sirve para guardar los objetivos.
        public array $goals,
        // Esta línea sirve para guardar los días por semana.
        public int $frequencyDays,
        // Esta línea sirve para guardar el equipamiento disponible.
        public array $equipmentAvailable,
        // Esta línea sirve para guardar el sexo (masculino por defecto).
        public string $sex = 'male',
        // Esta línea sirve para guardar los minutos por sesión (45 por defecto).
        public int $sessionMinutes = 45,
        // Esta línea sirve para guardar el lugar de entrenamiento (gimnasio por defecto).
        public string $place = 'gym',
        // Esta línea sirve para guardar las lesiones (ninguna por defecto).
        public array $injuries = [],
    ) {}

    // Esta línea sirve para declarar el método que devuelve el objetivo principal.
    public function primaryGoal(): string
    {
        // Esta línea sirve para devolver el primer objetivo, o "health" si no hay.
        return $this->goals[0] ?? 'health';
    }
}
