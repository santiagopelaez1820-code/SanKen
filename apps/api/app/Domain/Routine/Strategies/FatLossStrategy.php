<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las estrategias de rutina.

namespace App\Domain\Routine\Strategies;

// Esta línea sirve para importar el contrato de las estrategias de rutina.
use App\Domain\Routine\Contracts\RoutineStrategyInterface;
// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivo: lose_fat.
 * Reps más altas y descansos cortos para elevar el estrés metabólico,
 * manteniendo suficientes compuestos para preservar masa muscular.
 */
// Esta línea sirve para declarar la estrategia para perder grasa.
final readonly class FatLossStrategy implements RoutineStrategyInterface
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
        // Esta línea sirve para preferir 60% de ejercicios compuestos.
        return 0.6;
    }
}
