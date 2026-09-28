<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * `value` es el peso real levantado (kg) y `reps` las repeticiones de esa
 * serie — no un 1RM estimado. Ver la migración add_reps_to_personal_records.
 */
class PersonalRecord extends Model
{
    protected $fillable = ['user_id', 'exercise_id', 'record_type', 'value', 'reps', 'achieved_at', 'workout_set_id'];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'reps' => 'integer',
            'achieved_at' => 'date',
        ];
    }

    /**
     * Criterio único de "superar el récord" para el registro manual y la
     * detección en entrenamiento: más peso gana; con el mismo peso, más
     * repeticiones. Es lo que el usuario espera al ver "100 kg × 5" en
     * pantalla — nunca una comparación contra un número que no ve.
     */
    public function isBeatenBy(float $weightKg, int $reps): bool
    {
        $currentWeight = round((float) $this->value, 2);
        $weightKg = round($weightKg, 2);

        if ($weightKg !== $currentWeight) {
            return $weightKg > $currentWeight;
        }

        return $reps > (int) ($this->reps ?? 0);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function workoutSet(): BelongsTo
    {
        return $this->belongsTo(WorkoutSet::class);
    }
}
