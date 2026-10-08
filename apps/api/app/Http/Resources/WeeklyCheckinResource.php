<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal) para tipar el resource.
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WeeklyCheckin */
// Esta línea sirve para declarar el resource que da formato a un check-in semanal.
class WeeklyCheckinResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el check-in en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir la semana.
            'week' => $this->week,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir el estado de ánimo elegido.
            'mood' => $this->mood,
            // Esta línea sirve para incluir el tema elegido.
            'topic' => $this->topic,
            // Esta línea sirve para incluir cuántas veces se pospuso.
            'postpone_count' => $this->postpone_count,
            // Esta línea sirve para incluir cuándo se respondió, en formato ISO 8601.
            'answered_at' => $this->answered_at?->toIso8601String(),
            // Esta línea sirve para incluir el id de la solicitud de soporte que generó (o null).
            'support_ticket_id' => $this->supportTicket?->id,
        ];
    }
}
