<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoutineTemplateDay extends Model
{
    protected $fillable = ['routine_template_id', 'day_order', 'label'];

    public function routineTemplate(): BelongsTo
    {
        return $this->belongsTo(RoutineTemplate::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(RoutineTemplateExercise::class)->orderBy('order');
    }
}
