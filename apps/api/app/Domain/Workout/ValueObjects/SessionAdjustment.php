<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los objetos de valor de entrenamiento.

namespace App\Domain\Workout\ValueObjects;

/**
 * Resultado de SessionReadinessAdjuster: cuánto recortar la sesión de hoy.
 * `setsDelta` siempre es <= 0 (nunca agrega series), `weightMultiplier`
 * siempre es <= 1.0 (nunca sube el peso — eso ya lo maneja
 * ProgressiveOverloadCalculator en base a rendimiento real, no a cómo se
 * sintió el usuario antes de empezar).
 */
// Esta línea sirve para declarar el objeto que describe cuánto recortar la sesión de hoy.
final readonly class SessionAdjustment
{
    // Esta línea sirve para declarar el constructor con sus propiedades.
    public function __construct(
        // Esta línea sirve para guardar cuántas series quitar (0 por defecto).
        public int $setsDelta = 0,
        // Esta línea sirve para guardar el multiplicador del peso (1 por defecto).
        public float $weightMultiplier = 1.0,
        // Esta línea sirve para guardar cuánto cambia el RPE (0 por defecto).
        public float $rpeDelta = 0.0,
        // Esta línea sirve para guardar la nota explicativa (o null).
        public ?string $note = null,
    ) {}

    // Esta línea sirve para declarar el método que crea un ajuste neutro.
    public static function none(): self
    {
        // Esta línea sirve para devolver un ajuste con todos los valores por defecto.
        return new self;
    }

    // Esta línea sirve para declarar el método que revisa si el ajuste no cambia nada.
    public function isNeutral(): bool
    {
        // Esta línea sirve para devolver verdadero si no quita series, no cambia el peso ni el RPE.
        return $this->setsDelta === 0 && $this->weightMultiplier === 1.0 && $this->rpeDelta === 0.0;
    }
}
