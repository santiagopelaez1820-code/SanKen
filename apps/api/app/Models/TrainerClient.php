<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene uno" (HasOne).
use Illuminate\Database\Eloquent\Relations\HasOne;
// Esta línea sirve para importar las opciones del registro de actividad de Spatie.
use Spatie\Activitylog\LogOptions;
// Esta línea sirve para importar el trait que registra los cambios del modelo (auditoría).
use Spatie\Activitylog\Traits\LogsActivity;

// Esta línea sirve para declarar el modelo de la relación entre entrenador y cliente.
class TrainerClient extends Model
{
    // Esta línea sirve para registrar en la auditoría los cambios de la relación.
    use LogsActivity;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir el entrenador.
        'trainer_id',
        // Esta línea sirve para permitir el cliente.
        'client_id',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir la fecha de inicio.
        'started_at',
        // Esta línea sirve para permitir la fecha de fin.
        'ended_at',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de inicio a fecha y hora.
            'started_at' => 'datetime',
            // Esta línea sirve para convertir la fecha de fin a fecha y hora.
            'ended_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con el entrenador.
    public function trainer(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna trainer_id).
        return $this->belongsTo(User::class, 'trainer_id');
    }

    // Esta línea sirve para declarar la relación con el cliente.
    public function client(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna client_id).
        return $this->belongsTo(User::class, 'client_id');
    }

    // Esta línea sirve para declarar la relación con la conversación de chat.
    public function conversation(): HasOne
    {
        // Esta línea sirve para definir que la relación tiene una conversación.
        return $this->hasOne(ChatConversation::class);
    }

    // Esta línea sirve para declarar las opciones del registro de auditoría.
    public function getActivitylogOptions(): LogOptions
    {
        // Esta línea sirve para partir de las opciones por defecto.
        return LogOptions::defaults()
            // Esta línea sirve para guardar los cambios con el nombre de log "trainer_client".
            ->useLogName('trainer_client')
            // Esta línea sirve para registrar solo estos campos.
            ->logOnly(['trainer_id', 'client_id', 'status', 'started_at', 'ended_at'])
            // Esta línea sirve para registrar solo los campos que cambiaron.
            ->logOnlyDirty()
            // Esta línea sirve para evitar guardar registros sin cambios.
            ->dontSubmitEmptyLogs();
    }
}
