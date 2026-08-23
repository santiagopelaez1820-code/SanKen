<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserXp extends Model
{
    protected $table = 'user_xp';

    protected $fillable = ['user_id', 'total_xp'];

    protected function casts(): array
    {
        return [
            'total_xp' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
