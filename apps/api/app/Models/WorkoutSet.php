<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutSet extends Model
{
    protected $fillable = [
        'workout_exercise_id',
        'set_number',
        'weight_kg',
        'reps',
        'rpe',
        'is_warmup',
        'completed',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'decimal:2',
            'rpe' => 'decimal:1',
            'is_warmup' => 'boolean',
            'completed' => 'boolean',
        ];
    }

    public function workoutExercise(): BelongsTo
    {
        return $this->belongsTo(WorkoutExercise::class);
    }
}
