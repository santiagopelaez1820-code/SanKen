<?php

// Esta línea sirve para ubicar esta interfaz en el espacio de nombres de los contratos de rutina.

namespace App\Domain\Routine\Contracts;

// Esta línea sirve para importar el objeto con los datos de un ejercicio.
use App\Domain\Routine\ValueObjects\ExerciseData;
// Esta línea sirve para importar el objeto que representa una rutina generada.
use App\Domain\Routine\ValueObjects\GeneratedRoutine;
// Esta línea sirve para importar el objeto con el perfil del onboarding.
use App\Domain\Routine\ValueObjects\OnboardingProfile;

// Esta línea sirve para declarar el contrato que debe cumplir cualquier motor que genere rutinas.
interface RoutineGeneratorInterface
{
    /**
     * @param  ExerciseData[]  $exercisePool
     */
    // Esta línea sirve para exigir el método que genera una rutina a partir del perfil y los ejercicios.
    public function generate(OnboardingProfile $profile, array $exercisePool): GeneratedRoutine;
}
