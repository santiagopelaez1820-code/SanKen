<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    protected $fillable = ['code', 'title', 'description', 'type', 'criteria', 'starts_at', 'ends_at'];

    protected function casts(): array
    {
        return [
            'criteria' => 'array',
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ChallengeParticipant::class);
    }
}
