<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkoutSession extends Model
{
    protected $fillable = [
        'user_id',
        'routine_day_id',
        'performed_at',
        'duration_minutes',
        'completed',
        'completed_as_planned',
        'skipped_at',
        'cancelled_at',
        'sleep_quality',
        'energy_level',
        'muscle_soreness',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'performed_at' => 'date',
            'completed' => 'boolean',
            'completed_as_planned' => 'boolean',
            'skipped_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function routineDay(): BelongsTo
    {
        return $this->belongsTo(RoutineDay::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(WorkoutExercise::class)->orderBy('order');
    }
}
