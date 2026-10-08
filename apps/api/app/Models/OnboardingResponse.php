<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las respuestas del onboarding.
class OnboardingResponse extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir el nivel.
        'level',
        // Esta línea sirve para permitir los objetivos.
        'goals',
        // Esta línea sirve para permitir la frecuencia semanal.
        'frequency_days',
        // Esta línea sirve para permitir la duración de la sesión en minutos.
        'session_minutes',
        // Esta línea sirve para permitir el lugar de entrenamiento.
        'place',
        // Esta línea sirve para permitir el equipamiento disponible.
        'equipment_available',
        // Esta línea sirve para permitir las lesiones.
        'injuries',
        // Esta línea sirve para permitir las notas de experiencia.
        'experience_notes',
        // Esta línea sirve para permitir si está completo.
        'completed',
        // Esta línea sirve para permitir la fecha en que se completó.
        'completed_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir los objetivos de JSON a arreglo.
            'goals' => 'array',
            // Esta línea sirve para convertir el equipamiento de JSON a arreglo.
            'equipment_available' => 'array',
            // Esta línea sirve para convertir las lesiones de JSON a arreglo.
            'injuries' => 'array',
            // Esta línea sirve para convertir "completo" a booleano.
            'completed' => 'boolean',
            // Esta línea sirve para convertir la fecha de finalización a fecha y hora.
            'completed_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que las respuestas pertenecen a un usuario.
        return $this->belongsTo(User::class);
    }
}
