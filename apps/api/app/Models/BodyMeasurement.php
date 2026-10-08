<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de las medidas corporales.
class BodyMeasurement extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el id del usuario.
        'user_id',
        // Esta línea sirve para permitir la fecha de la medición.
        'measured_at',
        // Esta línea sirve para permitir el peso.
        'weight_kg',
        // Esta línea sirve para permitir el porcentaje de grasa.
        'body_fat_pct',
        // Esta línea sirve para permitir el pecho.
        'chest_cm',
        // Esta línea sirve para permitir la cintura.
        'waist_cm',
        // Esta línea sirve para permitir la cadera.
        'hip_cm',
        // Esta línea sirve para permitir el brazo.
        'arm_cm',
        // Esta línea sirve para permitir el muslo.
        'thigh_cm',
        // Esta línea sirve para permitir la URL de la foto de progreso.
        'progress_photo_url',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de medición a fecha.
            'measured_at' => 'date',
            // Esta línea sirve para convertir el peso a decimal con 2 decimales.
            'weight_kg' => 'decimal:2',
            // Esta línea sirve para convertir el porcentaje de grasa a decimal con 1 decimal.
            'body_fat_pct' => 'decimal:1',
            // Esta línea sirve para convertir el pecho a decimal con 1 decimal.
            'chest_cm' => 'decimal:1',
            // Esta línea sirve para convertir la cintura a decimal con 1 decimal.
            'waist_cm' => 'decimal:1',
            // Esta línea sirve para convertir la cadera a decimal con 1 decimal.
            'hip_cm' => 'decimal:1',
            // Esta línea sirve para convertir el brazo a decimal con 1 decimal.
            'arm_cm' => 'decimal:1',
            // Esta línea sirve para convertir el muslo a decimal con 1 decimal.
            'thigh_cm' => 'decimal:1',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario dueño de la medida.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que la medida pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
