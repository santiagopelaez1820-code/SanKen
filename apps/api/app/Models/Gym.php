<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Gym extends Model
{
    protected $fillable = ['name', 'city_id', 'address', 'verified'];

    protected function casts(): array
    {
        return [
            'verified' => 'boolean',
        ];
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
