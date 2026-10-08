<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los eventos.

namespace App\Events;

// Esta línea sirve para importar el modelo Challenge (reto).
use App\Models\Challenge;
// Esta línea sirve para importar la clase base de los canales de broadcasting.
use Illuminate\Broadcasting\Channel;
// Esta línea sirve para importar el trait para interactuar con los sockets.
use Illuminate\Broadcasting\InteractsWithSockets;
// Esta línea sirve para importar la clase de canal privado.
use Illuminate\Broadcasting\PrivateChannel;
// Esta línea sirve para importar la interfaz que emite el evento de inmediato.
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
// Esta línea sirve para importar el trait que permite despachar el evento.
use Illuminate\Foundation\Events\Dispatchable;
// Esta línea sirve para importar el trait que serializa modelos.
use Illuminate\Queue\SerializesModels;

/**
 * Primer evento de broadcasting de la app (Sprint 10: retos). Implementa
 * ShouldBroadcastNow, no ShouldBroadcast: este último encolaría el envío
 * (requiere queue:work corriendo, la misma dependencia problemática ya
 * documentada para la generación de rutinas) — acá el broadcast tiene que
 * salir en el mismo request que completa la sesión para que el leaderboard
 * se sienta "en vivo" de verdad, con o sin queue:work activo.
 */
// Esta línea sirve para declarar el evento que avisa en tiempo real que cambió el progreso de un reto.
class ChallengeProgressUpdated implements ShouldBroadcastNow
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>  $leaderboard
     */
    // Esta línea sirve para declarar el constructor con sus datos.
    public function __construct(
        // Esta línea sirve para guardar el reto.
        public readonly Challenge $challenge,
        // Esta línea sirve para guardar la tabla de posiciones.
        public readonly array $leaderboard,
    ) {}

    // Esta línea sirve para declarar el método que indica en qué canal se emite.
    public function broadcastOn(): Channel
    {
        // Esta línea sirve para emitir en el canal privado del reto.
        return new PrivateChannel('challenges.'.$this->challenge->id);
    }

    // Esta línea sirve para declarar el método que define el nombre del evento.
    public function broadcastAs(): string
    {
        // Esta línea sirve para llamar al evento "progress.updated".
        return 'progress.updated';
    }

    /**
     * @return array{leaderboard: array<int, array{rank: int, user_id: int, user_name: string, progress_value: float, completed: bool, is_viewer: bool}>}
     */
    // Esta línea sirve para declarar el método que define los datos que se envían.
    public function broadcastWith(): array
    {
        // Esta línea sirve para enviar la tabla de posiciones.
        return ['leaderboard' => $this->leaderboard];
    }
}
