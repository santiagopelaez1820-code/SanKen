<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BodyMeasurement extends Model
{
    protected $fillable = [
        'user_id',
        'measured_at',
        'weight_kg',
        'body_fat_pct',
        'chest_cm',
        'waist_cm',
        'hip_cm',
        'arm_cm',
        'thigh_cm',
        'progress_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'measured_at' => 'date',
            'weight_kg' => 'decimal:2',
            'body_fat_pct' => 'decimal:1',
            'chest_cm' => 'decimal:1',
            'waist_cm' => 'decimal:1',
            'hip_cm' => 'decimal:1',
            'arm_cm' => 'decimal:1',
            'thigh_cm' => 'decimal:1',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
