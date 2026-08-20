<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrSubmission extends Model
{
    /**
     * `status` tiene DEFAULT 'pending' a nivel de columna, pero un DEFAULT
     * de DB no se refleja en la instancia devuelta por create() a menos
     * que se declare también acá (mismo patrón que Report — ver ese
     * modelo para el bug real que esto evita).
     */
    protected $attributes = [
        'status' => 'pending',
    ];

    protected $fillable = [
        'user_id',
        'exercise_id',
        'weight_kg',
        'reps',
        'estimated_1rm',
        'video_url',
        'status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'decimal:2',
            'estimated_1rm' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }
}
