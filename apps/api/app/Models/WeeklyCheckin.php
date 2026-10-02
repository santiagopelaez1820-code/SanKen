<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Check-in semanal: "¿cómo te has sentido esta semana con tus
 * entrenamientos?". Una fila por usuario y semana ISO (índice único), así
 * que nunca hay dos check-ins de la misma semana. Ver WeeklyCheckinService.
 *
 * Preparado para personalización de rutinas: `mood` + `context` (rutina
 * activa, sesiones completadas) son la señal; scopeAnswered() es la consulta
 * base. HOY no se usa para cambiar rutinas automáticamente.
 */
class WeeklyCheckin extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_POSTPONED = 'postponed';

    public const STATUS_DISMISSED = 'dismissed';

    public const STATUS_ANSWERED = 'answered';

    protected $fillable = [
        'user_id',
        'week',
        'status',
        'mood',
        'topic',
        'postpone_count',
        'postponed_until',
        'notified_at',
        'shown_at',
        'answered_at',
        'context',
    ];

    protected function casts(): array
    {
        return [
            'context' => 'array',
            'postponed_until' => 'datetime',
            'notified_at' => 'datetime',
            'shown_at' => 'datetime',
            'answered_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supportTicket(): HasOne
    {
        return $this->hasOne(SupportTicket::class);
    }

    public function scopeAnswered(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ANSWERED);
    }
}
