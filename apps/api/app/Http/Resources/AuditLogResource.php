<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;
// Esta línea sirve para importar el modelo Activity de Spatie (registro de auditoría).
use Spatie\Activitylog\Models\Activity;

/** @mixin Activity */
// Esta línea sirve para declarar el resource que da formato a un registro de auditoría.
class AuditLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el registro en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el nombre del log.
            'log_name' => $this->log_name,
            // Esta línea sirve para incluir la descripción.
            'description' => $this->description,
            // Esta línea sirve para incluir el evento (creado, actualizado, borrado...).
            'event' => $this->event,
            // Esta línea sirve para incluir el tipo de registro afectado.
            'subject_type' => $this->subject_type,
            // Esta línea sirve para incluir el id del registro afectado.
            'subject_id' => $this->subject_id,
            // Esta línea sirve para incluir quién hizo el cambio solo si se conoce.
            'causer' => $this->when($this->causer, fn () => [
                // Esta línea sirve para incluir el id de quien hizo el cambio.
                'id' => $this->causer->id,
                // Esta línea sirve para incluir el nombre de quien hizo el cambio.
                'name' => $this->causer->name,
            ]),
            // Esta línea sirve para incluir los cambios realizados.
            'changes' => $this->properties,
            // Esta línea sirve para incluir la fecha en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
