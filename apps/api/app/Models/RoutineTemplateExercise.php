<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los ejercicios de un día de plantilla.
class RoutineTemplateExercise extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el día de la plantilla.
        'routine_template_day_id',
        // Esta línea sirve para permitir el ejercicio.
        'exercise_id',
        // Esta línea sirve para permitir el orden.
        'order',
        // Esta línea sirve para permitir las series por defecto.
        'default_sets',
        // Esta línea sirve para permitir las repeticiones por defecto.
        'default_reps',
        // Esta línea sirve para permitir el descanso en segundos.
        'rest_seconds',
        // Esta línea sirve para permitir el RPE por defecto.
        'default_rpe',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el RPE a decimal con 1 decimal.
            'default_rpe' => 'decimal:1',
        ];
    }

    // Esta línea sirve para declarar la relación con el día de la plantilla.
    public function routineTemplateDay(): BelongsTo
    {
        // Esta línea sirve para definir que el ejercicio pertenece a un día de plantilla.
        return $this->belongsTo(RoutineTemplateDay::class);
    }

    // Esta línea sirve para declarar la relación con el ejercicio del catálogo.
    public function exercise(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un ejercicio.
        return $this->belongsTo(Exercise::class);
    }
}
