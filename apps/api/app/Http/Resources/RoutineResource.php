<?php

namespace App\Http\Resources;

use App\Models\Routine;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Routine */
class RoutineResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'goal' => $this->goal,
            'split_type' => $this->split_type,
            'frequency_days' => $this->frequency_days,
            'duration_weeks' => $this->duration_weeks,
            'is_active' => $this->is_active,
            'starts_at' => $this->starts_at?->toDateString(),
            'ends_at' => $this->ends_at?->toDateString(),
            'days' => RoutineDayResource::collection($this->whenLoaded('days')),
        ];
    }
}
