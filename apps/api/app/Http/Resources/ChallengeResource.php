<?php

namespace App\Http\Resources;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Challenge */
class ChallengeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // `participants` viene precargado desde el controller, filtrado al
        // participante del usuario autenticado (a lo sumo uno) — así este
        // resource no dispara una query N+1 por reto listado.
        $participant = $this->participants->first();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'criteria' => $this->criteria,
            'starts_at' => $this->starts_at->toDateString(),
            'ends_at' => $this->ends_at->toDateString(),
            'joined' => $participant !== null,
            'progress_value' => $participant ? (float) $participant->progress_value : null,
            'completed' => $participant?->completed ?? false,
        ];
    }
}
