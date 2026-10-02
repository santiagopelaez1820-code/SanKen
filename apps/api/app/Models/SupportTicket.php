<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Solicitud de un usuario al equipo de SanKen (duda, reclamo, observación,
 * sugerencia, problema técnico u otro) con su conversación. Catálogos en
 * config/support.php. Solo el dueño y el equipo (super_admin) pueden verla —
 * ver SupportTicketPolicy.
 */
class SupportTicket extends Model
{
    public const STATUS_OPEN = 'open';

    public const STATUS_IN_REVIEW = 'in_review';

    public const STATUS_ANSWERED = 'answered';

    public const STATUS_RESOLVED = 'resolved';

    public const STATUS_CLOSED = 'closed';

    public const SOURCE_APP = 'app';

    public const SOURCE_WEEKLY_CHECKIN = 'weekly_checkin';

    protected $fillable = [
        'user_id',
        'type',
        'subject',
        'status',
        'priority',
        'source',
        'weekly_checkin_id',
        'assigned_to',
        'context',
        'last_message_at',
        'last_message_by_staff',
        'first_response_at',
        'resolved_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'context' => 'array',
            'last_message_at' => 'datetime',
            'last_message_by_staff' => 'boolean',
            'first_response_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function weeklyCheckin(): BelongsTo
    {
        return $this->belongsTo(WeeklyCheckin::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(SupportTicketMessage::class)->orderBy('created_at')->orderBy('id');
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    /** Abiertas/en revisión cuyo último mensaje es del usuario: el equipo le debe una respuesta. */
    public function scopeAwaitingStaff(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_OPEN, self::STATUS_IN_REVIEW])
            ->where('last_message_by_staff', false);
    }
}
