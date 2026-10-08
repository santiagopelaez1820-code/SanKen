<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las estrategias de rutina.

namespace App\Domain\Routine\Strategies;

// Esta línea sirve para importar el contrato de las estrategias de rutina.
use App\Domain\Routine\Contracts\RoutineStrategyInterface;
// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;

/**
 * Objetivos: strength, sport_performance.
 * Rango 1-6 reps, RIR 1-3, descanso 2-5min — prioriza casi exclusivamente
 * movimientos compuestos, donde se genera la mayor adaptación de fuerza.
 */
// Esta línea sirve para declarar la estrategia para fuerza y rendimiento deportivo.
final readonly class StrengthStrategy implements RoutineStrategyInterface
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
        // Esta línea sirve para preferir 85% de ejercicios compuestos.
        return 0.85;
    }
}
