<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de las conversaciones de chat.
class ChatConversation extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['trainer_client_id'];

    // Esta línea sirve para declarar la relación con la relación entrenador-cliente.
    public function trainerClient(): BelongsTo
    {
        // Esta línea sirve para definir que la conversación pertenece a una relación entrenador-cliente.
        return $this->belongsTo(TrainerClient::class);
    }

    // Esta línea sirve para declarar la relación con los mensajes.
    public function messages(): HasMany
    {
        // Esta línea sirve para definir que la conversación tiene muchos mensajes (columna conversation_id).
        return $this->hasMany(ChatMessage::class, 'conversation_id');
    }
}
