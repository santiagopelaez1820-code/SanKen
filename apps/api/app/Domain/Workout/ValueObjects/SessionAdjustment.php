<?php

namespace App\Domain\Workout\ValueObjects;

/**
 * Resultado de SessionReadinessAdjuster: cuánto recortar la sesión de hoy.
 * `setsDelta` siempre es <= 0 (nunca agrega series), `weightMultiplier`
 * siempre es <= 1.0 (nunca sube el peso — eso ya lo maneja
 * ProgressiveOverloadCalculator en base a rendimiento real, no a cómo se
 * sintió el usuario antes de empezar).
 */
final readonly class SessionAdjustment
{
    public function __construct(
        public int $setsDelta = 0,
        public float $weightMultiplier = 1.0,
        public float $rpeDelta = 0.0,
        public ?string $note = null,
    ) {}

    public static function none(): self
    {
        return new self();
    }

    public function isNeutral(): bool
    {
        return $this->setsDelta === 0 && $this->weightMultiplier === 1.0 && $this->rpeDelta === 0.0;
    }
}
