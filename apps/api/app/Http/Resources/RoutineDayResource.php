<?php

namespace App\Http\Resources;

use App\Models\RoutineDay;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineDay */
class RoutineDayResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'day_order' => $this->day_order,
            'label' => $this->label,
            'target_muscle_groups' => $this->target_muscle_groups,
            'exercises' => RoutineExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
