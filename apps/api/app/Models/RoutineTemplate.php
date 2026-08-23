<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoutineTemplate extends Model
{
    protected $fillable = ['name', 'sex', 'frequency_days', 'split_type', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function days(): HasMany
    {
        return $this->hasMany(RoutineTemplateDay::class)->orderBy('day_order');
    }

    /**
     * Frecuencias con al menos una plantilla activa — reemplaza el
     * `config('onboarding.frequency_days')` fijo: agregar una plantilla
     * nueva desde Super Admin habilita esa frecuencia en el onboarding sin
     * tocar código.
     *
     * @return list<int>
     */
    public static function activeFrequencyDays(): array
    {
        return static::query()
            ->where('is_active', true)
            ->distinct()
            ->orderBy('frequency_days')
            ->pluck('frequency_days')
            ->map(fn ($value) => (int) $value)
            ->values()
            ->all();
    }
}
