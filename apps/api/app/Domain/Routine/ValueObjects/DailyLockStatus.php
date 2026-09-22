<?php

namespace App\Domain\Routine\ValueObjects;

use Illuminate\Support\Carbon;

/**
 * Resultado de DetermineDailyLockStatusAction: si el usuario ya "gastó" el
 * turno de hoy para esta rutina, y en tal caso cuándo vuelve a abrirse.
 */
final readonly class DailyLockStatus
{
    public function __construct(
        public bool $locked,
        public ?Carbon $unlocksAt = null,
        public ?string $reason = null,
    ) {}

    public static function unlocked(): self
    {
        return new self(locked: false);
    }
}
