<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las postulaciones de PR.
class PrSubmission extends Model
{
    /**
     * `status` tiene DEFAULT 'pending' a nivel de columna, pero un DEFAULT
     * de DB no se refleja en la instancia devuelta por create() a menos
     * que se declare también acá (mismo patrón que Report — ver ese
     * modelo para el bug real que esto evita).
     */
    // Esta línea sirve para definir los valores por defecto de los atributos.
    protected $attributes = [
        // Esta línea sirve para dejar la postulación como pendiente por defecto.
        'status' => 'pending',
    ];

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el ejercicio.
        'exercise_id',
        // Esta línea sirve para permitir el peso.
        'weight_kg',
        // Esta línea sirve para permitir las repeticiones.
        'reps',
        // Esta línea sirve para permitir el 1RM estimado.
        'estimated_1rm',
        // Esta línea sirve para permitir la URL del video.
        'video_url',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir quién la revisó.
        'reviewed_by',
        // Esta línea sirve para permitir cuándo se revisó.
        'reviewed_at',
        // Esta línea sirve para permitir el motivo del rechazo.
        'rejection_reason',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el peso a decimal con 2 decimales.
            'weight_kg' => 'decimal:2',
            // Esta línea sirve para convertir el 1RM estimado a decimal con 2 decimales.
            'estimated_1rm' => 'decimal:2',
            // Esta línea sirve para convertir la fecha de revisión a fecha y hora.
            'reviewed_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario que postuló.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la postulación pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el ejercicio.
    public function exercise(): BelongsTo
    {
        // Esta línea sirve para definir que la postulación pertenece a un ejercicio.
        return $this->belongsTo(Exercise::class);
    }

    // Esta línea sirve para declarar la relación con el admin que la revisó.
    public function reviewer(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna reviewed_by).
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Esta línea sirve para declarar el scope que filtra las postulaciones pendientes.
    public function scopePending(Builder $query): Builder
    {
        // Esta línea sirve para filtrar las que están pendientes.
        return $query->where('status', 'pending');
    }

    // Esta línea sirve para declarar el scope que filtra las postulaciones aprobadas.
    public function scopeApproved(Builder $query): Builder
    {
        // Esta línea sirve para filtrar las que están aprobadas.
        return $query->where('status', 'approved');
    }
}
