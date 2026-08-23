<?php

namespace App\Http\Resources;

use App\Models\RoutineTemplateDay;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplateDay */
class AdminRoutineTemplateDayResource extends JsonResource
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
            'exercises' => AdminRoutineTemplateExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
