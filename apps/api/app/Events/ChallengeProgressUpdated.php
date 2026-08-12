<?php

namespace App\Events;

use App\Models\Challenge;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Primer evento de broadcasting de la app (Sprint 10: retos). Implementa
 * ShouldBroadcastNow, no ShouldBroadcast: este último encolaría el envío
 * (requiere queue:work corriendo, la misma dependencia problemática ya
 * documentada para la generación de rutinas) — acá el broadcast tiene que
 * salir en el mismo request que completa la sesión para que el leaderboard
 * se sienta "en vivo" de verdad, con o sin queue:work activo.
 */
class ChallengeProgressUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>  $leaderboard
     */
    public function __construct(
        public readonly Challenge $challenge,
        public readonly array $leaderboard,
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('challenges.'.$this->challenge->id);
    }

    public function broadcastAs(): string
    {
        return 'progress.updated';
    }

    /**
     * @return array{leaderboard: array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>}
     */
    public function broadcastWith(): array
    {
        return ['leaderboard' => $this->leaderboard];
    }
}
