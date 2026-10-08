<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Solicitud de un usuario al equipo de SanKen (duda, reclamo, observación,
 * sugerencia, problema técnico u otro) con su conversación. Catálogos en
 * config/support.php. Solo el dueño y el equipo (super_admin) pueden verla —
 * ver SupportTicketPolicy.
 */
// Esta línea sirve para declarar el modelo de las solicitudes de soporte.
class SupportTicket extends Model
{
    // Esta línea sirve para definir el estado "abierta".
    public const STATUS_OPEN = 'open';

    // Esta línea sirve para definir el estado "en revisión".
    public const STATUS_IN_REVIEW = 'in_review';

    // Esta línea sirve para definir el estado "respondida".
    public const STATUS_ANSWERED = 'answered';

    // Esta línea sirve para definir el estado "resuelta".
    public const STATUS_RESOLVED = 'resolved';

    // Esta línea sirve para definir el estado "cerrada".
    public const STATUS_CLOSED = 'closed';

    // Esta línea sirve para definir el origen "desde la app".
    public const SOURCE_APP = 'app';

    // Esta línea sirve para definir el origen "desde el check-in semanal".
    public const SOURCE_WEEKLY_CHECKIN = 'weekly_checkin';

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el tipo.
        'type',
        // Esta línea sirve para permitir el asunto.
        'subject',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir la prioridad.
        'priority',
        // Esta línea sirve para permitir el origen.
        'source',
        // Esta línea sirve para permitir el check-in que la originó.
        'weekly_checkin_id',
        // Esta línea sirve para permitir el responsable asignado.
        'assigned_to',
        // Esta línea sirve para permitir el contexto.
        'context',
        // Esta línea sirve para permitir la fecha del último mensaje.
        'last_message_at',
        // Esta línea sirve para permitir si el último mensaje fue del equipo.
        'last_message_by_staff',
        // Esta línea sirve para permitir la fecha de la primera respuesta.
        'first_response_at',
        // Esta línea sirve para permitir la fecha de resolución.
        'resolved_at',
        // Esta línea sirve para permitir la fecha de cierre.
        'closed_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el contexto de JSON a arreglo.
            'context' => 'array',
            // Esta línea sirve para convertir la fecha del último mensaje a fecha y hora.
            'last_message_at' => 'datetime',
            // Esta línea sirve para convertir "último mensaje del equipo" a booleano.
            'last_message_by_staff' => 'boolean',
            // Esta línea sirve para convertir la fecha de la primera respuesta a fecha y hora.
            'first_response_at' => 'datetime',
            // Esta línea sirve para convertir la fecha de resolución a fecha y hora.
            'resolved_at' => 'datetime',
            // Esta línea sirve para convertir la fecha de cierre a fecha y hora.
            'closed_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la solicitud pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el responsable asignado.
    public function assignee(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna assigned_to).
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Esta línea sirve para declarar la relación con el check-in semanal.
    public function weeklyCheckin(): BelongsTo
    {
        // Esta línea sirve para definir que la solicitud pertenece a un check-in semanal.
        return $this->belongsTo(WeeklyCheckin::class);
    }

    // Esta línea sirve para declarar la relación con los mensajes.
    public function messages(): HasMany
    {
        // Esta línea sirve para definir que tiene muchos mensajes, ordenados por fecha y id.
        return $this->hasMany(SupportTicketMessage::class)->orderBy('created_at')->orderBy('id');
    }

    // Esta línea sirve para declarar el método que indica si la solicitud está cerrada.
    public function isClosed(): bool
    {
        // Esta línea sirve para devolver si el estado es "cerrada".
        return $this->status === self::STATUS_CLOSED;
    }

    /** Abiertas/en revisión cuyo último mensaje es del usuario: el equipo le debe una respuesta. */
    // Esta línea sirve para declarar el scope que filtra las solicitudes que esperan respuesta del equipo.
    public function scopeAwaitingStaff(Builder $query): Builder
    {
        // Esta línea sirve para filtrar las abiertas o en revisión.
        return $query->whereIn('status', [self::STATUS_OPEN, self::STATUS_IN_REVIEW])
            // Esta línea sirve para filtrar las que tienen el último mensaje del usuario.
            ->where('last_message_by_staff', false);
    }
}
