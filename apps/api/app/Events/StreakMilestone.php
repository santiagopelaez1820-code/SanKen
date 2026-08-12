<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Disparado cuando AggregateDailyStatsAction detecta que la racha del
 * usuario acaba de cruzar un umbral (7/30/100 días) que no había cruzado
 * antes (Sprint 8: gamificación). Fire-and-forget.
 */
class StreakMilestone
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly int $streakDays,
    ) {}
}
