<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Challenge (reto) para tipar el resource.
use App\Models\Challenge;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Challenge */
// Esta línea sirve para declarar el resource que da formato a un reto.
class ChallengeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el reto en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // `participants` viene precargado desde el controller, filtrado al
        // participante del usuario autenticado (a lo sumo uno) — así este
        // resource no dispara una query N+1 por reto listado.
        // Esta línea sirve para tomar la participación del usuario (o null si no se unió).
        $participant = $this->participants->first();

        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el título.
            'title' => $this->title,
            // Esta línea sirve para incluir la descripción.
            'description' => $this->description,
            // Esta línea sirve para incluir el tipo.
            'type' => $this->type,
            // Esta línea sirve para incluir los criterios.
            'criteria' => $this->criteria,
            // Esta línea sirve para incluir la fecha de inicio.
            'starts_at' => $this->starts_at->toDateString(),
            // Esta línea sirve para incluir la fecha de fin.
            'ends_at' => $this->ends_at->toDateString(),
            // Esta línea sirve para indicar si el usuario se unió.
            'joined' => $participant !== null,
            // Esta línea sirve para incluir el progreso del usuario como número decimal (o null).
            'progress_value' => $participant ? (float) $participant->progress_value : null,
            // Esta línea sirve para indicar si el usuario lo completó.
            'completed' => $participant?->completed ?? false,
        ];
    }
}
