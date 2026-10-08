<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los retos.
class Challenge extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['code', 'title', 'description', 'type', 'criteria', 'starts_at', 'ends_at'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir los criterios de JSON a arreglo.
            'criteria' => 'array',
            // Esta línea sirve para convertir la fecha de inicio a fecha.
            'starts_at' => 'date',
            // Esta línea sirve para convertir la fecha de fin a fecha.
            'ends_at' => 'date',
        ];
    }

    // Esta línea sirve para declarar la relación con los participantes del reto.
    public function participants(): HasMany
    {
        // Esta línea sirve para definir que el reto tiene muchos participantes.
        return $this->hasMany(ChallengeParticipant::class);
    }
}
