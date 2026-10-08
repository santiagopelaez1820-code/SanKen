<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de rutina.

namespace App\Domain\Routine\ValueObjects;

// Esta línea sirve para importar Carbon para manejar fechas.
use Illuminate\Support\Carbon;

/**
 * Resultado de DetermineDailyLockStatusAction: si el usuario ya "gastó" el
 * turno de hoy para esta rutina, y en tal caso cuándo vuelve a abrirse.
 */
// Esta línea sirve para declarar el objeto que representa el estado del bloqueo diario.
final readonly class DailyLockStatus
{
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para indicar si el entrenamiento de hoy ya se usó.
        public bool $locked,
        // Esta línea sirve para indicar cuándo se desbloquea (si está bloqueado).
        public ?Carbon $unlocksAt = null,
        // Esta línea sirve para indicar el motivo: completado o saltado.
        public ?string $reason = null,
    ) {}

    // Esta línea sirve para declarar el método que crea un estado desbloqueado.
    public static function unlocked(): self
    {
        // Esta línea sirve para devolver un estado sin bloqueo.
        return new self(locked: false);
    }
}
