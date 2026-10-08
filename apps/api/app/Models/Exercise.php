<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "muchos a muchos" (BelongsToMany).
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

// Esta línea sirve para declarar el modelo de los ejercicios.
class Exercise extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el nombre.
        'name',
        // Esta línea sirve para permitir el músculo principal.
        'primary_muscle_id',
        // Esta línea sirve para permitir el equipamiento.
        'equipment',
        // Esta línea sirve para permitir el nivel.
        'level',
        // Esta línea sirve para permitir el tipo.
        'type',
        // Esta línea sirve para permitir las instrucciones.
        'instructions',
        // Esta línea sirve para permitir los errores comunes.
        'common_mistakes',
        // Esta línea sirve para permitir los consejos.
        'tips',
        // Esta línea sirve para permitir la URL del video.
        'video_url',
        // Esta línea sirve para permitir la URL de la imagen.
        'image_url',
        // Esta línea sirve para permitir si está activo.
        'is_active',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir "activo" a booleano.
            'is_active' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con el músculo principal.
    public function primaryMuscle(): BelongsTo
    {
        // Esta línea sirve para definir que el ejercicio pertenece a un grupo muscular (columna primary_muscle_id).
        return $this->belongsTo(MuscleGroup::class, 'primary_muscle_id');
    }

    // Esta línea sirve para declarar la relación con los músculos secundarios.
    public function secondaryMuscles(): BelongsToMany
    {
        // Esta línea sirve para definir la relación muchos a muchos con la tabla exercise_secondary_muscles.
        return $this->belongsToMany(MuscleGroup::class, 'exercise_secondary_muscles');
    }

    // Esta línea sirve para declarar la relación con los ejercicios alternativos.
    public function alternatives(): BelongsToMany
    {
        // Esta línea sirve para definir la relación muchos a muchos del ejercicio consigo mismo.
        return $this->belongsToMany(
            // Esta línea sirve para indicar que el modelo relacionado también es Exercise.
            Exercise::class,
            // Esta línea sirve para usar la tabla exercise_alternatives.
            'exercise_alternatives',
            // Esta línea sirve para usar la columna exercise_id para este ejercicio.
            'exercise_id',
            // Esta línea sirve para usar la columna alternative_exercise_id para la alternativa.
            'alternative_exercise_id',
        );
    }
}
