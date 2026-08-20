<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkoutExercise extends Model
{
    protected $fillable = [
        'workout_session_id',
        'exercise_id',
        'order',
        'all_sets_completed',
        'target_sets',
        'target_reps',
        'rest_seconds',
        'target_rpe',
        'suggested_weight_kg',
        'suggested_reps_per_set',
    ];

    protected function casts(): array
    {
        return [
            'all_sets_completed' => 'boolean',
            'target_rpe' => 'decimal:1',
            'suggested_weight_kg' => 'decimal:2',
            'suggested_reps_per_set' => 'array',
        ];
    }

    public function workoutSession(): BelongsTo
    {
        return $this->belongsTo(WorkoutSession::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function sets(): HasMany
    {
        return $this->hasMany(WorkoutSet::class)->orderBy('set_number');
    }
}
