<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MuscleGroup extends Model
{
    protected $fillable = ['name', 'slug'];

    public function primaryExercises(): HasMany
    {
        return $this->hasMany(Exercise::class, 'primary_muscle_id');
    }

    public function secondaryExercises(): BelongsToMany
    {
        return $this->belongsToMany(Exercise::class, 'exercise_secondary_muscles');
    }
}
