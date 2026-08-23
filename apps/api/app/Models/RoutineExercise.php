<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutineExercise extends Model
{
    protected $fillable = [
        'routine_day_id',
        'exercise_id',
        'order',
        'target_sets',
        'target_reps',
        'rest_seconds',
        'target_rpe',
        'suggested_weight_kg',
        'suggested_reps_per_set',
        'consecutive_failures',
    ];

    protected function casts(): array
    {
        return [
            'target_rpe' => 'decimal:1',
            'suggested_weight_kg' => 'decimal:2',
            'suggested_reps_per_set' => 'array',
        ];
    }

    public function routineDay(): BelongsTo
    {
        return $this->belongsTo(RoutineDay::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
