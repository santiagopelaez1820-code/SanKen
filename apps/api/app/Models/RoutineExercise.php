<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los ejercicios de un día de rutina.
class RoutineExercise extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el día de rutina.
        'routine_day_id',
        // Esta línea sirve para permitir el ejercicio.
        'exercise_id',
        // Esta línea sirve para permitir el orden.
        'order',
        // Esta línea sirve para permitir las series objetivo.
        'target_sets',
        // Esta línea sirve para permitir las repeticiones objetivo.
        'target_reps',
        // Esta línea sirve para permitir el descanso en segundos.
        'rest_seconds',
        // Esta línea sirve para permitir el RPE objetivo.
        'target_rpe',
        // Esta línea sirve para permitir el peso sugerido.
        'suggested_weight_kg',
        // Esta línea sirve para permitir las repeticiones sugeridas por serie.
        'suggested_reps_per_set',
        // Esta línea sirve para permitir las fallas consecutivas (para la sobrecarga progresiva).
        'consecutive_failures',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el RPE a decimal con 1 decimal.
            'target_rpe' => 'decimal:1',
            // Esta línea sirve para convertir el peso sugerido a decimal con 2 decimales.
            'suggested_weight_kg' => 'decimal:2',
            // Esta línea sirve para convertir las repeticiones sugeridas de JSON a arreglo.
            'suggested_reps_per_set' => 'array',
        ];
    }

    // Esta línea sirve para declarar la relación con el día de rutina.
    public function routineDay(): BelongsTo
    {
        // Esta línea sirve para definir que el ejercicio pertenece a un día de rutina.
        return $this->belongsTo(RoutineDay::class);
    }

    // Esta línea sirve para declarar la relación con el ejercicio del catálogo.
    public function exercise(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un ejercicio.
        return $this->belongsTo(Exercise::class);
    }
}
