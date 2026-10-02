<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un mensaje de la conversación de una solicitud. `is_staff` distingue las
 * respuestas del equipo de SanKen de las del usuario (el autor puede quedar
 * en null si se elimina la cuenta de quien respondió). No hay endpoints de
 * edición ni borrado: el historial queda tal cual se escribió.
 */
class SupportTicketMessage extends Model
{
    protected $fillable = [
        'support_ticket_id',
        'author_id',
        'is_staff',
        'body',
    ];

    protected function casts(): array
    {
        return [
            'is_staff' => 'boolean',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'support_ticket_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
