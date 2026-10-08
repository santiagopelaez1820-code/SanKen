<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de las plantillas de rutina.
class RoutineTemplate extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['name', 'sex', 'frequency_days', 'level', 'split_type', 'is_active'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir "activa" a booleano.
            'is_active' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con los días de la plantilla.
    public function days(): HasMany
    {
        // Esta línea sirve para definir que la plantilla tiene muchos días, ordenados por su orden.
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
    // Esta línea sirve para declarar el método que devuelve las frecuencias con plantilla activa.
    public static function activeFrequencyDays(): array
    {
        // Esta línea sirve para consultar las plantillas.
        return static::query()
            // Esta línea sirve para filtrar solo las activas.
            ->where('is_active', true)
            // Esta línea sirve para quitar los repetidos.
            ->distinct()
            // Esta línea sirve para ordenar por frecuencia.
            ->orderBy('frequency_days')
            // Esta línea sirve para obtener solo la frecuencia.
            ->pluck('frequency_days')
            // Esta línea sirve para convertir cada frecuencia a entero.
            ->map(fn ($value) => (int) $value)
            // Esta línea sirve para reindexar la lista.
            ->values()
            // Esta línea sirve para convertir la colección en arreglo.
            ->all();
    }
}
