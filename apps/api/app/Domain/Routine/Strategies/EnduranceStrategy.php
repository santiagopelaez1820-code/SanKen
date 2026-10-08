<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las estrategias de rutina.

namespace App\Domain\Routine\Strategies;

// Esta línea sirve para importar el contrato de las estrategias de rutina.
use App\Domain\Routine\Contracts\RoutineStrategyInterface;
// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivos: endurance, health, cardio.
 * Reps altas, descansos cortos, mayor variedad de aislamiento — prioriza
 * capacidad de trabajo y salud general sobre carga máxima.
 */
// Esta línea sirve para declarar la estrategia para resistencia, salud y cardio.
final readonly class EnduranceStrategy implements RoutineStrategyInterface
{
    // Esta línea sirve para declarar el constructor que recibe los parámetros.
    public function __construct(
        // Esta línea sirve para guardar los parámetros del objetivo.
        private GoalParameters $parameters,
    ) {}

    // Esta línea sirve para declarar el método que devuelve los parámetros del objetivo.
    public function goalParameters(): GoalParameters
    {
        // Esta línea sirve para devolver los parámetros guardados.
        return $this->parameters;
    }

    // Esta línea sirve para declarar el método que devuelve la proporción de compuestos.
    public function preferredCompoundRatio(): float
    {
        // Esta línea sirve para preferir 40% de ejercicios compuestos.
        return 0.4;
    }
}
