<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los días de una plantilla de rutina.
class RoutineTemplateDay extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['routine_template_id', 'day_order', 'label'];

    // Esta línea sirve para declarar la relación con la plantilla.
    public function routineTemplate(): BelongsTo
    {
        // Esta línea sirve para definir que el día pertenece a una plantilla.
        return $this->belongsTo(RoutineTemplate::class);
    }

    // Esta línea sirve para declarar la relación con los ejercicios del día.
    public function exercises(): HasMany
    {
        // Esta línea sirve para definir que el día tiene muchos ejercicios, ordenados por su orden.
        return $this->hasMany(RoutineTemplateExercise::class)->orderBy('order');
    }
}
