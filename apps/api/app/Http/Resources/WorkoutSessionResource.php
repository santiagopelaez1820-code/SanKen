<?php

namespace App\Http\Resources;

use App\Models\WorkoutSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkoutSession */
class WorkoutSessionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'routine_day_id' => $this->routine_day_id,
            'routine_day_label' => $this->routineDay?->label,
            'performed_at' => $this->performed_at?->toDateString(),
            'duration_minutes' => $this->duration_minutes,
            'completed' => $this->completed,
            'completed_as_planned' => $this->completed_as_planned,
            'sleep_quality' => $this->sleep_quality,
            'energy_level' => $this->energy_level,
            'muscle_soreness' => $this->muscle_soreness,
            'notes' => $this->notes,
            'exercises' => WorkoutExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
