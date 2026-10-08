<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las estadísticas diarias de cada usuario.
class UserStatsDaily extends Model
{
    // Esta línea sirve para indicar el nombre de la tabla.
    protected $table = 'user_stats_daily';

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir la fecha.
        'stat_date',
        // Esta línea sirve para permitir la cantidad de entrenamientos.
        'workouts_count',
        // Esta línea sirve para permitir el total de series.
        'total_sets',
        // Esta línea sirve para permitir el volumen total en kilos.
        'total_volume_kg',
        // Esta línea sirve para permitir los minutos de entrenamiento.
        'training_minutes',
        // Esta línea sirve para permitir la racha actual en días.
        'current_streak_days',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha a fecha.
            'stat_date' => 'date',
            // Esta línea sirve para convertir el volumen a decimal con 2 decimales.
            'total_volume_kg' => 'decimal:2',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la estadística pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
