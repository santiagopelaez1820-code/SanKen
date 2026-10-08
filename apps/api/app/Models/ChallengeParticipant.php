<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de la participación de un usuario en un reto.
class ChallengeParticipant extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['challenge_id', 'user_id', 'progress_value', 'completed'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir el progreso a decimal con 2 decimales.
            'progress_value' => 'decimal:2',
            // Esta línea sirve para convertir "completado" a booleano.
            'completed' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con el reto.
    public function challenge(): BelongsTo
    {
        // Esta línea sirve para definir que la participación pertenece a un reto.
        return $this->belongsTo(Challenge::class);
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la participación pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
