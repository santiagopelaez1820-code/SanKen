<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Exercise extends Model
{
    protected $fillable = [
        'name',
        'primary_muscle_id',
        'equipment',
        'level',
        'type',
        'instructions',
        'common_mistakes',
        'tips',
        'video_url',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function primaryMuscle(): BelongsTo
    {
        return $this->belongsTo(MuscleGroup::class, 'primary_muscle_id');
    }

    public function secondaryMuscles(): BelongsToMany
    {
        return $this->belongsToMany(MuscleGroup::class, 'exercise_secondary_muscles');
    }

    public function alternatives(): BelongsToMany
    {
        return $this->belongsToMany(
            Exercise::class,
            'exercise_alternatives',
            'exercise_id',
            'alternative_exercise_id',
        );
    }
}
