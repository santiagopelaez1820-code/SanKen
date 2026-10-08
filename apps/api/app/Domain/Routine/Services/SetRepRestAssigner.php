<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rutina.

namespace App\Domain\Routine\Services;

// Esta línea sirve para importar el objeto que representa un ejercicio generado.
use App\Domain\Routine\ValueObjects\GeneratedExercise;
// Esta línea sirve para importar el objeto con los parámetros de un objetivo.
use App\Domain\Routine\ValueObjects\GoalParameters;

// Esta línea sirve para declarar el servicio que asigna series, repeticiones y descanso.
final class SetRepRestAssigner
{
    /**
     * @param  int[]  $exerciseIds  en orden de ejecución
     * @return GeneratedExercise[]
     */
    // Esta línea sirve para declarar el método que recibe los ejercicios y los parámetros del objetivo.
    public function assign(array $exerciseIds, GoalParameters $parameters): array
    {
        // Esta línea sirve para devolver la lista de ejercicios generados reindexada.
        return array_values(array_map(
            // Esta línea sirve para crear un ejercicio generado por cada id.
            fn (int $exerciseId, int $index) => new GeneratedExercise(
                // Esta línea sirve para pasar el id del ejercicio.
                exerciseId: $exerciseId,
                // Esta línea sirve para pasar su posición.
                order: $index + 1,
                // Esta línea sirve para pasar las series del objetivo.
                targetSets: $parameters->sets,
                // Esta línea sirve para pasar las repeticiones del objetivo.
                targetReps: $parameters->targetReps,
                // Esta línea sirve para pasar el descanso del objetivo.
                restSeconds: $parameters->restSeconds,
                // Esta línea sirve para calcular el RPE como 10 menos las repeticiones en reserva.
                targetRpe: round(10 - $parameters->rir, 1),
            ),
            // Esta línea sirve para pasar la lista de ids de ejercicios.
            $exerciseIds,
            // Esta línea sirve para pasar la lista de posiciones.
            array_keys($exerciseIds),
        ));
    }
}
