<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de las sesiones de entrenamiento.
class WorkoutSession extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el día de rutina.
        'routine_day_id',
        // Esta línea sirve para permitir la fecha.
        'performed_at',
        // Esta línea sirve para permitir la duración en minutos.
        'duration_minutes',
        // Esta línea sirve para permitir si se completó.
        'completed',
        // Esta línea sirve para permitir si se hizo como estaba planeado.
        'completed_as_planned',
        // Esta línea sirve para permitir cuándo se saltó.
        'skipped_at',
        // Esta línea sirve para permitir cuándo se canceló.
        'cancelled_at',
        // Esta línea sirve para permitir la calidad del sueño.
        'sleep_quality',
        // Esta línea sirve para permitir el nivel de energía.
        'energy_level',
        // Esta línea sirve para permitir el dolor muscular.
        'muscle_soreness',
        // Esta línea sirve para permitir la nota del ajuste por el precheck.
        'readiness_note',
        // Esta línea sirve para permitir las notas.
        'notes',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha a fecha.
            'performed_at' => 'date',
            // Esta línea sirve para convertir "completada" a booleano.
            'completed' => 'boolean',
            // Esta línea sirve para convertir "como estaba planeado" a booleano.
            'completed_as_planned' => 'boolean',
            // Esta línea sirve para convertir la fecha en que se saltó a fecha y hora.
            'skipped_at' => 'datetime',
            // Esta línea sirve para convertir la fecha en que se canceló a fecha y hora.
            'cancelled_at' => 'datetime',
        ];
    }

    /** Derivado de readiness_note en vez de una columna aparte — ver la migration que agrega readiness_note. */
    // Esta línea sirve para declarar el atributo calculado que indica si se ajustó por el precheck.
    public function getReadinessAdjustedAttribute(): bool
    {
        // Esta línea sirve para devolver verdadero si hay nota de ajuste.
        return $this->readiness_note !== null;
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la sesión pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el día de rutina.
    public function routineDay(): BelongsTo
    {
        // Esta línea sirve para definir que la sesión pertenece a un día de rutina.
        return $this->belongsTo(RoutineDay::class);
    }

    // Esta línea sirve para declarar la relación con los ejercicios de la sesión.
    public function exercises(): HasMany
    {
        // Esta línea sirve para definir que tiene muchos ejercicios, ordenados por su orden.
        return $this->hasMany(WorkoutExercise::class)->orderBy('order');
    }
}
