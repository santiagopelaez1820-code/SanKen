<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "muchos a muchos" (BelongsToMany).
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

// Esta línea sirve para declarar el modelo de los logros.
class Achievement extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['code', 'name', 'description', 'xp_bonus'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la XP extra a entero.
            'xp_bonus' => 'integer',
        ];
    }

    // Esta línea sirve para declarar la relación con los usuarios que desbloquearon el logro.
    public function users(): BelongsToMany
    {
        // Esta línea sirve para definir la relación muchos a muchos con la tabla user_achievements.
        return $this->belongsToMany(User::class, 'user_achievements')
            // Esta línea sirve para usar el modelo intermedio UserAchievement.
            ->using(UserAchievement::class)
            // Esta línea sirve para incluir la fecha en que se desbloqueó.
            ->withPivot('achieved_at')
            // Esta línea sirve para guardar las fechas de creación y actualización de la tabla intermedia.
            ->withTimestamps();
    }
}
