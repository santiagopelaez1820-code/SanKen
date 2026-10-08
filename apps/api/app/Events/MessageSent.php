<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los eventos.

namespace App\Events;

// Esta línea sirve para importar el modelo ChatMessage (mensaje).
use App\Models\ChatMessage;
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
 * ShouldBroadcastNow, no ShouldBroadcast: mismo motivo que
 * ChallengeProgressUpdated (Sprint 10) — un mensaje tiene que llegar al hilo
 * abierto en el mismo request en el que se envía, sin depender de que
 * queue:work esté corriendo.
 */
// Esta línea sirve para declarar el evento que emite en tiempo real un mensaje de chat.
class MessageSent implements ShouldBroadcastNow
{
    // Esta línea sirve para incluir los traits para despacharlo y serializarlo.
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe el mensaje.
    public function __construct(
        // Esta línea sirve para guardar el mensaje.
        public readonly ChatMessage $message,
    ) {}

    // Esta línea sirve para declarar el método que indica en qué canal se emite.
    public function broadcastOn(): Channel
    {
        // Esta línea sirve para emitir en el canal privado de la conversación.
        return new PrivateChannel('conversations.'.$this->message->conversation_id);
    }

    // Esta línea sirve para declarar el método que define el nombre del evento.
    public function broadcastAs(): string
    {
        // Esta línea sirve para llamar al evento "message.sent".
        return 'message.sent';
    }

    /**
     * @return array{id: int, conversation_id: int, sender_id: int, sender_name: string, body: string, created_at: string}
     */
    // Esta línea sirve para declarar el método que define los datos que se envían.
    public function broadcastWith(): array
    {
        // Esta línea sirve para devolver los datos del mensaje.
        return [
            // Esta línea sirve para incluir el id del mensaje.
            'id' => $this->message->id,
            // Esta línea sirve para incluir el id de la conversación.
            'conversation_id' => $this->message->conversation_id,
            // Esta línea sirve para incluir el id de quien lo envió.
            'sender_id' => $this->message->sender_id,
            // Esta línea sirve para incluir el nombre de quien lo envió.
            'sender_name' => $this->message->sender->name,
            // Esta línea sirve para incluir el texto.
            'body' => $this->message->body,
            // Esta línea sirve para incluir la fecha de envío en formato ISO.
            'created_at' => $this->message->created_at->toIso8601String(),
        ];
    }
}
