<?php

namespace App\Http\Resources;

use App\Models\TrainerClient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Perspectiva del cliente sobre su propia fila trainer_clients — inverso de
 * TrainerClientResource, que solo expone el `client` (perspectiva del
 * entrenador). Nueva en Sprint 11: no existía ninguna vista del lado
 * cliente de la relación antes de esto.
 *
 * @mixin TrainerClient
 */
class MyTrainerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'trainer_client_id' => $this->id,
            'status' => $this->status,
            'trainer' => new UserResource($this->whenLoaded('trainer')),
        ];
    }
}
