<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene uno" (HasOne).
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
// Esta línea sirve para declarar el modelo de los check-ins semanales.
class WeeklyCheckin extends Model
{
    // Esta línea sirve para definir el estado "pendiente".
    public const STATUS_PENDING = 'pending';

    // Esta línea sirve para definir el estado "pospuesto".
    public const STATUS_POSTPONED = 'postponed';

    // Esta línea sirve para definir el estado "descartado".
    public const STATUS_DISMISSED = 'dismissed';

    // Esta línea sirve para definir el estado "respondido".
    public const STATUS_ANSWERED = 'answered';

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir la semana.
        'week',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir el estado de ánimo.
        'mood',
        // Esta línea sirve para permitir el tema.
        'topic',
        // Esta línea sirve para permitir cuántas veces se pospuso.
        'postpone_count',
        // Esta línea sirve para permitir hasta cuándo se pospuso.
        'postponed_until',
        // Esta línea sirve para permitir cuándo se notificó.
        'notified_at',
        // Esta línea sirve para permitir cuándo se mostró.
        'shown_at',
        // Esta línea sirve para permitir cuándo se respondió.
        'answered_at',
        // Esta línea sirve para permitir el contexto.
        'context',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el contexto de JSON a arreglo.
            'context' => 'array',
            // Esta línea sirve para convertir "pospuesto hasta" a fecha y hora.
            'postponed_until' => 'datetime',
            // Esta línea sirve para convertir la fecha de notificación a fecha y hora.
            'notified_at' => 'datetime',
            // Esta línea sirve para convertir la fecha en que se mostró a fecha y hora.
            'shown_at' => 'datetime',
            // Esta línea sirve para convertir la fecha de respuesta a fecha y hora.
            'answered_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el check-in pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con la solicitud de soporte que generó.
    public function supportTicket(): HasOne
    {
        // Esta línea sirve para definir que el check-in tiene una solicitud de soporte.
        return $this->hasOne(SupportTicket::class);
    }

    // Esta línea sirve para declarar el scope que filtra los check-ins respondidos.
    public function scopeAnswered(Builder $query): Builder
    {
        // Esta línea sirve para filtrar los que están respondidos.
        return $query->where('status', self::STATUS_ANSWERED);
    }
}
