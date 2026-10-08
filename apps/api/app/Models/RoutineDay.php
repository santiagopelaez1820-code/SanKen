<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los días de una rutina.
class RoutineDay extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['routine_id', 'day_order', 'label', 'target_muscle_groups'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir los grupos musculares de JSON a arreglo.
            'target_muscle_groups' => 'array',
        ];
    }

    // Esta línea sirve para declarar la relación con la rutina.
    public function routine(): BelongsTo
    {
        // Esta línea sirve para definir que el día pertenece a una rutina.
        return $this->belongsTo(Routine::class);
    }

    // Esta línea sirve para declarar la relación con los ejercicios del día.
    public function exercises(): HasMany
    {
        // Esta línea sirve para definir que el día tiene muchos ejercicios, ordenados por su orden.
        return $this->hasMany(RoutineExercise::class)->orderBy('order');
    }
}
