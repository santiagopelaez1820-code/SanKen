<?php

// Esta línea sirve para ubicar esta interfaz en el espacio de nombres de los contratos de rutina.

namespace App\Domain\Routine\Contracts;

// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;

// Esta línea sirve para declarar el contrato de las estrategias de rutina por objetivo.
interface RoutineStrategyInterface
{
    // Esta línea sirve para exigir el método que devuelve los parámetros del objetivo.
    public function goalParameters(): GoalParameters;

    /**
     * Proporción objetivo de ejercicios compuestos vs. aislamiento (0-1).
     * Fuerza prioriza compuestos casi exclusivamente; resistencia favorece
     * más variedad/aislamiento.
     */
    // Esta línea sirve para exigir el método que devuelve la proporción de ejercicios compuestos.
    public function preferredCompoundRatio(): float;
}
