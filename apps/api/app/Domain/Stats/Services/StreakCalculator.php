<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de estadísticas.

namespace App\Domain\Stats\Services;

// Esta línea sirve para importar CarbonImmutable para manejar fechas.
use Carbon\CarbonImmutable;

/**
 * Racha de días consecutivos entrenando. Tolera un día de descanso: la racha
 * sigue viva si el entrenamiento más reciente fue hoy o ayer respecto a
 * $asOf; si el hueco es de 2+ días, la racha se considera rota (0).
 */
// Esta línea sirve para declarar el servicio que calcula la racha de días entrenando.
final class StreakCalculator
{
    /**
     * @param  array<int, string>  $workoutDates  Fechas únicas (Y-m-d) en las que el usuario completó al menos un entrenamiento.
     */
    // Esta línea sirve para declarar el método que calcula la racha a partir de las fechas entrenadas.
    public function calculate(array $workoutDates, CarbonImmutable $asOf): int
    {
        // Esta línea sirve para revisar si no hay fechas de entrenamiento.
        if ($workoutDates === []) {
            // Esta línea sirve para devolver 0 porque no hay racha.
            return 0;
        }

        // Esta línea sirve para preparar las fechas.
        $dates = collect($workoutDates)
            // Esta línea sirve para quitar las repetidas.
            ->unique()
            // Esta línea sirve para convertir cada fecha en un objeto de fecha al inicio del día.
            ->map(fn (string $date) => CarbonImmutable::parse($date)->startOfDay())
            // Esta línea sirve para ordenarlas de la más reciente a la más antigua.
            ->sortByDesc(fn (CarbonImmutable $date) => $date->timestamp)
            // Esta línea sirve para reindexar la lista.
            ->values();

        // Esta línea sirve para tomar la fecha de referencia al inicio del día.
        $asOf = $asOf->startOfDay();
        // Esta línea sirve para obtener la fecha de entrenamiento más reciente.
        $latest = $dates->first();

        // Esta línea sirve para revisar si pasaron más de un día desde el último entrenamiento.
        if ($latest->diffInDays($asOf) > 1) {
            // Esta línea sirve para devolver 0 porque la racha se rompió.
            return 0;
        }

        // Esta línea sirve para empezar la racha en 1.
        $streak = 1;
        // Esta línea sirve para empezar el recorrido desde la fecha más reciente.
        $cursor = $latest;

        // Esta línea sirve para recorrer las fechas siguientes.
        foreach ($dates->slice(1) as $date) {
            // Esta línea sirve para revisar si la fecha es justo el día anterior.
            if ($cursor->subDay()->equalTo($date)) {
                // Esta línea sirve para sumar un día a la racha.
                $streak++;
                // Esta línea sirve para avanzar el recorrido a esa fecha.
                $cursor = $date;

                // Esta línea sirve para seguir con la siguiente fecha.
                continue;
            }

            // Esta línea sirve para cortar el recorrido porque hay un hueco.
            break;
        }

        // Esta línea sirve para devolver la racha calculada.
        return $streak;
    }
}
