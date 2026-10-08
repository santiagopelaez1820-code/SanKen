<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar la clase base de los modelos de tablas intermedias (Pivot).
use Illuminate\Database\Eloquent\Relations\Pivot;

// Esta línea sirve para declarar el modelo intermedio entre usuarios y logros.
class UserAchievement extends Pivot
{
    // Esta línea sirve para indicar que la tabla tiene id autoincremental.
    public $incrementing = true;

    // Esta línea sirve para indicar el nombre de la tabla.
    protected $table = 'user_achievements';

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'achievement_id', 'achieved_at'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha del logro a fecha y hora.
            'achieved_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con el logro.
    public function achievement(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un logro.
        return $this->belongsTo(Achievement::class);
    }
}
