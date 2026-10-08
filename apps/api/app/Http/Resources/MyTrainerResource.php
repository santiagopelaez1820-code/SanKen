<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Perspectiva del cliente sobre su propia fila trainer_clients — inverso de
 * TrainerClientResource, que solo expone el `client` (perspectiva del
 * entrenador). Nueva en Sprint 11: no existía ninguna vista del lado
 * cliente de la relación antes de esto.
 *
 * @mixin TrainerClient
 */
// Esta línea sirve para declarar el resource que da formato a la relación vista desde el cliente.
class MyTrainerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la relación en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id de la relación.
            'trainer_client_id' => $this->id,
            // Esta línea sirve para incluir el estado de la relación.
            'status' => $this->status,
            // Esta línea sirve para incluir el entrenador solo si se cargó.
            'trainer' => new UserResource($this->whenLoaded('trainer')),
        ];
    }
}
