<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutineTemplateExercise extends Model
{
    protected $fillable = [
        'routine_template_day_id',
        'exercise_id',
        'order',
        'default_sets',
        'default_reps',
        'rest_seconds',
        'default_rpe',
    ];

    protected function casts(): array
    {
        return [
            'default_rpe' => 'decimal:1',
        ];
    }

    public function routineTemplateDay(): BelongsTo
    {
        return $this->belongsTo(RoutineTemplateDay::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
