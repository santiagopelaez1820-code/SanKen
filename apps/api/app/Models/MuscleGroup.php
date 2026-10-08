<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "muchos a muchos" (BelongsToMany).
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los grupos musculares.
class MuscleGroup extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['name', 'slug'];

    // Esta línea sirve para declarar la relación con los ejercicios donde es músculo principal.
    public function primaryExercises(): HasMany
    {
        // Esta línea sirve para definir que tiene muchos ejercicios (columna primary_muscle_id).
        return $this->hasMany(Exercise::class, 'primary_muscle_id');
    }

    // Esta línea sirve para declarar la relación con los ejercicios donde es músculo secundario.
    public function secondaryExercises(): BelongsToMany
    {
        // Esta línea sirve para definir la relación muchos a muchos con la tabla exercise_secondary_muscles.
        return $this->belongsToMany(Exercise::class, 'exercise_secondary_muscles');
    }
}
