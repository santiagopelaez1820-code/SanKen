<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de la XP acumulada de cada usuario.
class UserXp extends Model
{
    // Esta línea sirve para indicar el nombre de la tabla.
    protected $table = 'user_xp';

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'total_xp'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la XP total a entero.
            'total_xp' => 'integer',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la XP pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
