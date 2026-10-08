<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las series registradas.
class WorkoutSet extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el ejercicio de la sesión.
        'workout_exercise_id',
        // Esta línea sirve para permitir el número de serie.
        'set_number',
        // Esta línea sirve para permitir el peso.
        'weight_kg',
        // Esta línea sirve para permitir las repeticiones.
        'reps',
        // Esta línea sirve para permitir el RPE.
        'rpe',
        // Esta línea sirve para permitir si es de calentamiento.
        'is_warmup',
        // Esta línea sirve para permitir si se completó.
        'completed',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el peso a decimal con 2 decimales.
            'weight_kg' => 'decimal:2',
            // Esta línea sirve para convertir el RPE a decimal con 1 decimal.
            'rpe' => 'decimal:1',
            // Esta línea sirve para convertir "calentamiento" a booleano.
            'is_warmup' => 'boolean',
            // Esta línea sirve para convertir "completada" a booleano.
            'completed' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con el ejercicio de la sesión.
    public function workoutExercise(): BelongsTo
    {
        // Esta línea sirve para definir que la serie pertenece a un ejercicio de la sesión.
        return $this->belongsTo(WorkoutExercise::class);
    }
}
