<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Disparado cuando DetectPersonalRecordAction confirma un récord personal
 * nuevo (Sprint 8: gamificación). Fire-and-forget: no se espera su retorno.
 */
class PRBroken
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}
}
