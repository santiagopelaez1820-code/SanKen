<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los tokens de notificaciones de los celulares.
class PushDeviceToken extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'token', 'platform'];

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el token pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
