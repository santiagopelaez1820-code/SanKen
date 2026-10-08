<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rutina.

namespace App\Domain\Routine\Services;

// Esta línea sirve para importar el objeto que define un día de la división.
use App\Domain\Routine\ValueObjects\DayDefinition;
// Esta línea sirve para importar el objeto que define una división completa.
use App\Domain\Routine\ValueObjects\SplitDefinition;

// Esta línea sirve para declarar el servicio que elige la división (split) de la rutina.
final class SplitSelector
{
    /**
     * @param  array<int, array{type: string, days: array<int, array{label: string, muscles: string[]}>}>  $splitsConfig
     *                                                                                                                    Config completo de routine_engine.splits, indexado por frecuencia semanal.
     */
    // Esta línea sirve para declarar el constructor que recibe la configuración de divisiones.
    public function __construct(
        // Esta línea sirve para guardar las divisiones disponibles por frecuencia semanal.
        private readonly array $splitsConfig,
    ) {}

    // Esta línea sirve para declarar el método que elige la división para una frecuencia.
    public function selectFor(int $frequencyDays): SplitDefinition
    {
        // Esta línea sirve para tomar la división de esa frecuencia, o la más cercana disponible.
        $config = $this->splitsConfig[$frequencyDays] ?? $this->closestAvailable($frequencyDays);

        // Esta línea sirve para devolver la definición de la división.
        return new SplitDefinition(
            // Esta línea sirve para pasar el tipo de división.
            type: $config['type'],
            // Esta línea sirve para pasar los días convertidos en definiciones.
            days: array_map(
                // Esta línea sirve para crear la definición de cada día con su etiqueta y músculos.
                fn (array $day) => new DayDefinition($day['label'], $day['muscles']),
                // Esta línea sirve para pasar la lista de días de la configuración.
                $config['days'],
            ),
        );
    }

    /**
     * Si la frecuencia no está configurada exactamente, cae al split
     * disponible más cercano en vez de fallar.
     */
    // Esta línea sirve para declarar el método privado que busca la división más cercana.
    private function closestAvailable(int $frequencyDays): array
    {
        // Esta línea sirve para obtener las frecuencias disponibles.
        $available = array_keys($this->splitsConfig);
        // Esta línea sirve para ordenarlas por cercanía a la frecuencia pedida.
        usort($available, fn ($a, $b) => abs($a - $frequencyDays) <=> abs($b - $frequencyDays));

        // Esta línea sirve para devolver la división más cercana.
        return $this->splitsConfig[$available[0]];
    }
}
