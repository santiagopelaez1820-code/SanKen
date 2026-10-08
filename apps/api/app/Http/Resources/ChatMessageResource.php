<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo ChatMessage (mensaje de chat) para tipar el resource.
use App\Models\ChatMessage;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChatMessage */
// Esta línea sirve para declarar el resource que da formato a un mensaje de chat.
class ChatMessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el mensaje en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el id de la conversación.
            'conversation_id' => $this->conversation_id,
            // Esta línea sirve para incluir el id de quien lo envió.
            'sender_id' => $this->sender_id,
            // Esta línea sirve para incluir el nombre de quien lo envió.
            'sender_name' => $this->sender->name,
            // Esta línea sirve para incluir el texto.
            'body' => $this->body,
            // Esta línea sirve para indicar si lo envió el usuario autenticado.
            'is_mine' => $this->sender_id === $request->user()?->id,
            // Esta línea sirve para incluir la fecha en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
