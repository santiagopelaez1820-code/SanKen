<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar la clase Builder para tipar los scopes de consulta.
use Illuminate\Database\Eloquent\Builder;
// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación polimórfica (MorphTo).
use Illuminate\Database\Eloquent\Relations\MorphTo;

// Esta línea sirve para declarar el modelo de los reportes de contenido.
class Report extends Model
{
    // Esta línea sirve para usar las factories para crear reportes de prueba.
    use HasFactory;

    /**
     * `status` tiene DEFAULT 'pending' a nivel de columna, pero un DEFAULT
     * de DB no se refleja en la instancia devuelta por create() a menos
     * que se declare también acá — sin esto, el ReportResource armado
     * justo después de crear el registro serializaba `status: null` pese
     * a que la fila en la DB ya tenía 'pending' (bug real, atrapado por
     * ReportApiTest).
     */
    // Esta línea sirve para definir los valores por defecto de los atributos.
    protected $attributes = [
        // Esta línea sirve para dejar el reporte como pendiente por defecto.
        'status' => 'pending',
    ];

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = [
        // Esta línea sirve para permitir quién reporta.
        'reporter_id',
        // Esta línea sirve para permitir el tipo de contenido reportado.
        'reportable_type',
        // Esta línea sirve para permitir el id del contenido reportado.
        'reportable_id',
        // Esta línea sirve para permitir el motivo.
        'reason',
        // Esta línea sirve para permitir los detalles.
        'details',
        // Esta línea sirve para permitir el estado.
        'status',
        // Esta línea sirve para permitir quién lo resolvió.
        'resolved_by',
        // Esta línea sirve para permitir cuándo se resolvió.
        'resolved_at',
        // Esta línea sirve para permitir las notas de la resolución.
        'resolution_notes',
    ];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir la fecha de resolución a fecha y hora.
            'resolved_at' => 'datetime',
        ];
    }

    // Esta línea sirve para declarar la relación con quien hizo el reporte.
    public function reporter(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna reporter_id).
        return $this->belongsTo(User::class, 'reporter_id');
    }

    // Esta línea sirve para declarar la relación con quien lo resolvió.
    public function resolver(): BelongsTo
    {
        // Esta línea sirve para definir que pertenece a un usuario (columna resolved_by).
        return $this->belongsTo(User::class, 'resolved_by');
    }

    // Esta línea sirve para declarar la relación con el contenido reportado.
    public function reportable(): MorphTo
    {
        // Esta línea sirve para definir la relación polimórfica (puede apuntar a distintos tipos de modelo).
        return $this->morphTo();
    }

    // Esta línea sirve para declarar el scope que filtra los reportes pendientes.
    public function scopePending(Builder $query): Builder
    {
        // Esta línea sirve para filtrar los que están pendientes.
        return $query->where('status', 'pending');
    }
}
