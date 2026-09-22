<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Fila de uso real de la app — ver el docblock de la migración
 * `create_user_activity_events_table` para qué distingue 'heartbeat' de
 * 'login' y por qué la tabla no crece 1 fila por request.
 */
class UserActivityEvent extends Model
{
    public const TYPE_HEARTBEAT = 'heartbeat';

    public const TYPE_LOGIN = 'login';

    public const PLATFORM_WEB = 'web';

    public const PLATFORM_MOBILE = 'mobile';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event_type',
        'platform',
        'occurred_at',
        'activity_date',
    ];

    /**
     * `activity_date` NO lleva cast 'date' a propósito: el setter de ese
     * cast reformatea cualquier valor (incluso un string 'Y-m-d' ya
     * plano) con el formato de fecha COMPLETO de la conexión al guardar
     * ("2026-09-21 00:00:00"), lo que rompe el match exacto contra los
     * 'Y-m-d' que arma UsageAnalyticsCalculator para sus WHERE/GROUP BY.
     * Se guarda y se compara siempre como el mismo string plano.
     */
    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
