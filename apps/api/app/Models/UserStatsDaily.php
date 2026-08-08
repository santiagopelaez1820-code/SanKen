<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStatsDaily extends Model
{
    protected $table = 'user_stats_daily';

    protected $fillable = [
        'user_id',
        'stat_date',
        'workouts_count',
        'total_sets',
        'total_volume_kg',
        'training_minutes',
        'current_streak_days',
    ];

    protected function casts(): array
    {
        return [
            'stat_date' => 'date',
            'total_volume_kg' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
