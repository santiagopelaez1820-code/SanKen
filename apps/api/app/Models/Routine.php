<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Routine extends Model
{
    use LogsActivity;

    protected $fillable = [
        'user_id',
        'created_by_trainer_id',
        'created_by_admin_id',
        'source',
        'goal',
        'split_type',
        'frequency_days',
        'duration_weeks',
        'is_active',
        'starts_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function createdByTrainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_trainer_id');
    }

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_admin_id');
    }

    public function days(): HasMany
    {
        return $this->hasMany(RoutineDay::class)->orderBy('day_order');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('routine')
            ->logOnly([
                'user_id', 'created_by_trainer_id', 'created_by_admin_id', 'source', 'goal',
                'split_type', 'frequency_days', 'duration_weeks',
                'is_active', 'starts_at', 'ends_at',
            ])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
