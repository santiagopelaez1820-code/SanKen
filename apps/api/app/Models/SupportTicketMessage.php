<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un mensaje de la conversación de una solicitud. `is_staff` distingue las
 * respuestas del equipo de SanKen de las del usuario (el autor puede quedar
 * en null si se elimina la cuenta de quien respondió). No hay endpoints de
 * edición ni borrado: el historial queda tal cual se escribió.
 */
// Esta línea sirve para declarar el modelo de los mensajes de una solicitud de soporte.
class SupportTicketMessage extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir la solicitud.
        'support_ticket_id',
        // Esta línea sirve para permitir el autor.
        'author_id',
        // Esta línea sirve para permitir si lo escribió el equipo.
        'is_staff',
        // Esta línea sirve para permitir el texto.
        'body',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir "del equipo" a booleano.
            'is_staff' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con la solicitud.
    public function ticket(): BelongsTo
    {
        // Esta línea sirve para definir que el mensaje pertenece a una solicitud (columna support_ticket_id).
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }

    // Esta línea sirve para declarar la relación con el autor.
    public function author(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna author_id).
        return $this->belongsTo(User::class, 'author_id');
    }
}
