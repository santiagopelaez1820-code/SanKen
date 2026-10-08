<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;

// Esta línea sirve para declarar el modelo de las plantillas de retos.
class ChallengeTemplate extends Model
{
    /**
     * is_active tiene DEFAULT true a nivel de columna, pero un DEFAULT de
     * DB no se refleja en la instancia devuelta por create() a menos que
     * se declare también acá (mismo bug real que Report — ver ese modelo).
     */
    // Esta línea sirve para definir los valores por defecto de los atributos.
    protected $attributes = [
        // Esta línea sirve para dejar la plantilla activa por defecto.
        'is_active' => true,
    ];

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['code', 'title', 'description', 'type', 'metric', 'target', 'is_active'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la meta a decimal con 2 decimales.
            'target' => 'decimal:2',
            // Esta línea sirve para convertir "activa" a booleano.
            'is_active' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar el scope que filtra solo las plantillas activas.
    public function scopeActive(Builder $query): Builder
    {
        // Esta línea sirve para filtrar las plantillas activas.
        return $query->where('is_active', true);
    }
}
