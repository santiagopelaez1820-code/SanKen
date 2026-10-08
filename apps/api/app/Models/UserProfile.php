<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los perfiles de usuario.
class UserProfile extends Model
{
    // Esta línea sirve para usar las factories para crear perfiles de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir la edad.
        'age',
        // Esta línea sirve para permitir el sexo.
        'sex',
        // Esta línea sirve para permitir la altura.
        'height_cm',
        // Esta línea sirve para permitir el peso.
        'weight_kg',
        // Esta línea sirve para permitir la ciudad.
        'city_id',
        // Esta línea sirve para permitir el gimnasio.
        'gym_id',
        // Esta línea sirve para permitir la URL de la foto.
        'avatar_url',
        // Esta línea sirve para permitir la biografía.
        'bio',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la altura a decimal con 1 decimal.
            'height_cm' => 'decimal:1',
            // Esta línea sirve para convertir el peso a decimal con 1 decimal.
            'weight_kg' => 'decimal:1',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el perfil pertenece a un usuario.
        return $this->belongsTo(User::class);
    }

    // Esta línea sirve para declarar la relación con la ciudad.
    public function city(): BelongsTo
    {
        // Esta línea sirve para definir que el perfil pertenece a una ciudad.
        return $this->belongsTo(City::class);
    }

    // Esta línea sirve para declarar la relación con el gimnasio.
    public function gym(): BelongsTo
    {
        // Esta línea sirve para definir que el perfil pertenece a un gimnasio.
        return $this->belongsTo(Gym::class);
    }
}
