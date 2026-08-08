<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OnboardingResponse extends Model
{
    protected $fillable = [
        'user_id',
        'level',
        'goals',
        'frequency_days',
        'session_minutes',
        'place',
        'equipment_available',
        'injuries',
        'experience_notes',
        'completed',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'goals' => 'array',
            'equipment_available' => 'array',
            'injuries' => 'array',
            'completed' => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
