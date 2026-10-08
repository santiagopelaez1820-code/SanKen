<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente) para tipar el resource.
use App\Models\TrainerClient;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TrainerClient */
// Esta línea sirve para declarar el resource que da formato a la relación vista desde el entrenador.
class TrainerClientResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la relación en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir la fecha de inicio en formato ISO 8601.
            'started_at' => $this->started_at?->toIso8601String(),
            // Esta línea sirve para incluir la fecha de fin en formato ISO 8601.
            'ended_at' => $this->ended_at?->toIso8601String(),
            // Esta línea sirve para incluir el cliente solo si se cargó.
            'client' => new UserResource($this->whenLoaded('client')),
        ];
    }
}
