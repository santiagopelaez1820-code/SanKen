<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los recordatorios del calendario.
class CalendarReminder extends Model
{
    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['user_id', 'event_date', 'title', 'notes'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha del evento a fecha.
            'event_date' => 'date',
        ];
    }

    // Esta línea sirve para declarar la relación con el usuario dueño del recordatorio.
    public function user(): BelongsTo
    {
        // Esta línea sirve para definir que el recordatorio pertenece a un usuario.
        return $this->belongsTo(User::class);
    }
}
