<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * `value` es el peso real levantado (kg) y `reps` las repeticiones de esa
 * serie — no un 1RM estimado. Ver la migración add_reps_to_personal_records.
 */
// Esta línea sirve para declarar el modelo de los récords personales.
class PersonalRecord extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'exercise_id', 'record_type', 'value', 'reps', 'achieved_at', 'workout_set_id'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el valor a decimal con 2 decimales.
            'value' => 'decimal:2',
            // Esta línea sirve para convertir las repeticiones a entero.
            'reps' => 'integer',
            // Esta línea sirve para convertir la fecha del récord a fecha.
            'achieved_at' => 'date',
        ];
    }

    /**
     * Criterio único de "superar el récord" para el registro manual y la
     * detección en entrenamiento: más peso gana; con el mismo peso, más
     * repeticiones. Es lo que el usuario espera al ver "100 kg × 5" en
     * pantalla — nunca una comparación contra un número que no ve.
     */
    // Esta línea sirve para declarar el método que indica si una marca nueva supera el récord.
    public function isBeatenBy(float $weightKg, int $reps): bool
    {
        // Esta línea sirve para redondear el peso actual a 2 decimales.
        $currentWeight = round((float) $this->value, 2);
        // Esta línea sirve para redondear el peso nuevo a 2 decimales.
        $weightKg = round($weightKg, 2);

        // Esta línea sirve para revisar si los pesos son distintos.
        if ($weightKg !== $currentWeight) {
            // Esta línea sirve para devolver si el peso nuevo es mayor.
            return $weightKg > $currentWeight;
        }

        // Esta línea sirve para devolver si, con el mismo peso, hay más repeticiones.
        return $reps > (int) ($this->reps ?? 0);
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el récord pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el ejercicio.
    public function exercise(): BelongsTo
    {
        // Esta línea sirve para definir que el récord pertenece a un ejercicio.
        return $this->belongsTo(Exercise::class);
    }

    // Esta línea sirve para declarar la relación con la serie que lo logró.
    public function workoutSet(): BelongsTo
    {
        // Esta línea sirve para definir que el récord pertenece a una serie.
        return $this->belongsTo(WorkoutSet::class);
    }
}
