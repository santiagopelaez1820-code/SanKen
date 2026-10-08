<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Fila de uso real de la app — ver el docblock de la migración
 * `create_user_activity_events_table` para qué distingue 'heartbeat' de
 * 'login' y por qué la tabla no crece 1 fila por request.
 */
// Esta línea sirve para declarar el modelo de los eventos de actividad de los usuarios.
class UserActivityEvent extends Model
{
    // Esta línea sirve para definir el tipo de evento "heartbeat" (actividad periódica).
    public const TYPE_HEARTBEAT = 'heartbeat';

    // Esta línea sirve para definir el tipo de evento "login".
    public const TYPE_LOGIN = 'login';

    // Esta línea sirve para definir la plataforma web.
    public const PLATFORM_WEB = 'web';

    // Esta línea sirve para definir la plataforma móvil.
    public const PLATFORM_MOBILE = 'mobile';

    // Esta línea sirve para desactivar las columnas created_at y updated_at.
    public $timestamps = false;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el tipo de evento.
        'event_type',
        // Esta línea sirve para permitir la plataforma.
        'platform',
        // Esta línea sirve para permitir el momento del evento.
        'occurred_at',
        // Esta línea sirve para permitir la fecha del evento.
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
    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el momento del evento a fecha y hora.
            'occurred_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el evento pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
