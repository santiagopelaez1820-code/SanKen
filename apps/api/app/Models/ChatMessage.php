<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los mensajes de chat.
class ChatMessage extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['conversation_id', 'sender_id', 'body', 'read_at'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de lectura a fecha y hora.
            'read_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con la conversación.
    public function conversation(): BelongsTo
    {
        // Esta línea sirve para definir que el mensaje pertenece a una conversación (columna conversation_id).
        return $this->belongsTo(ChatConversation::class, 'conversation_id');
    }

    // Esta línea sirve para declarar la relación con quien envió el mensaje.
    public function sender(): BelongsTo
    {
        // Esta línea sirve para definir que el mensaje pertenece a un usuario (columna sender_id).
        return $this->belongsTo(User::class, 'sender_id');
    }
}
