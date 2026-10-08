<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo CalendarReminder (recordatorio) para tipar el resource.
use App\Models\CalendarReminder;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CalendarReminder */
// Esta línea sirve para declarar el resource que da formato a un recordatorio del calendario.
class CalendarReminderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el recordatorio en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para indicar que el evento es de tipo recordatorio.
            'type' => 'reminder',
            // Esta línea sirve para incluir la fecha del evento.
            'event_date' => $this->event_date->toDateString(),
            // Esta línea sirve para incluir el título.
            'title' => $this->title,
            // Esta línea sirve para incluir las notas.
            'notes' => $this->notes,
        ];
    }
}
