<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RankingSnapshot extends Model
{
    protected $fillable = ['user_id', 'scope_type', 'scope_value', 'metric_value', 'rank_position', 'snapshot_date'];

    protected function casts(): array
    {
        return [
            'metric_value' => 'decimal:2',
            'rank_position' => 'integer',
            'snapshot_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
