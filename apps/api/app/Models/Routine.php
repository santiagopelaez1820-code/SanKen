<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;
// Esta línea sirve para importar las opciones del registro de actividad de Spatie.
use Spatie\Activitylog\LogOptions;
// Esta línea sirve para importar el trait que registra los cambios del modelo (auditoría).
use Spatie\Activitylog\Traits\LogsActivity;

// Esta línea sirve para declarar el modelo de las rutinas.
class Routine extends Model
{
    // Esta línea sirve para registrar en la auditoría los cambios de la rutina.
    use LogsActivity;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el entrenador que la creó.
        'created_by_trainer_id',
        // Esta línea sirve para permitir el admin que la creó.
        'created_by_admin_id',
        // Esta línea sirve para permitir el origen.
        'source',
        // Esta línea sirve para permitir el objetivo.
        'goal',
        // Esta línea sirve para permitir el tipo de división.
        'split_type',
        // Esta línea sirve para permitir la frecuencia semanal.
        'frequency_days',
        // Esta línea sirve para permitir la duración en semanas.
        'duration_weeks',
        // Esta línea sirve para permitir si está activa.
        'is_active',
        // Esta línea sirve para permitir la fecha de inicio.
        'starts_at',
        // Esta línea sirve para permitir la fecha de fin.
        'ends_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir "activa" a booleano.
            'is_active' => 'boolean',
            // Esta línea sirve para convertir la fecha de inicio a fecha.
            'starts_at' => 'date',
            // Esta línea sirve para convertir la fecha de fin a fecha.
            'ends_at' => 'date',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario dueño de la rutina.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la rutina pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el entrenador que la creó.
    public function createdByTrainer(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna created_by_trainer_id).
        return $this->belongsTo(User::class, 'created_by_trainer_id');
    }

    // Esta línea sirve para declarar la relación con el admin que la creó.
    public function createdByAdmin(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna created_by_admin_id).
        return $this->belongsTo(User::class, 'created_by_admin_id');
    }

    // Esta línea sirve para declarar la relación con los días de la rutina.
    public function days(): HasMany
    {
        // Esta línea sirve para definir que la rutina tiene muchos días, ordenados por su orden.
        return $this->hasMany(RoutineDay::class)->orderBy('day_order');
    }

    // Esta línea sirve para declarar las opciones del registro de auditoría.
    public function getActivitylogOptions(): LogOptions
    {
        // Esta línea sirve para partir de las opciones por defecto.
        return LogOptions::defaults()
            // Esta línea sirve para guardar los cambios con el nombre de log "routine".
            ->useLogName('routine')
            // Esta línea sirve para registrar solo estos campos.
            ->logOnly([
                // Esta línea sirve para incluir usuario, creadores, origen y objetivo.
                'user_id', 'created_by_trainer_id', 'created_by_admin_id', 'source', 'goal',
                // Esta línea sirve para incluir división, frecuencia y duración.
                'split_type', 'frequency_days', 'duration_weeks',
                // Esta línea sirve para incluir si está activa y las fechas.
                'is_active', 'starts_at', 'ends_at',
            ])
            // Esta línea sirve para registrar solo los campos que cambiaron.
            ->logOnlyDirty()
            // Esta línea sirve para evitar guardar registros sin cambios.
            ->dontSubmitEmptyLogs();
    }
}
