<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ChallengeTemplate extends Model
{
    /**
     * is_active tiene DEFAULT true a nivel de columna, pero un DEFAULT de
     * DB no se refleja en la instancia devuelta por create() a menos que
     * se declare también acá (mismo bug real que Report — ver ese modelo).
     */
    protected $attributes = [
        'is_active' => true,
    ];

    protected $fillable = ['code', 'title', 'description', 'type', 'metric', 'target', 'is_active'];

    protected function casts(): array
    {
        return [
            'target' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
