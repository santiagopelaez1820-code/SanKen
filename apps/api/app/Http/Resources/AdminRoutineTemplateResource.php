<?php

namespace App\Http\Resources;

use App\Models\RoutineTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplate */
class AdminRoutineTemplateResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sex' => $this->sex,
            'frequency_days' => $this->frequency_days,
            'split_type' => $this->split_type,
            'is_active' => $this->is_active,
            'days' => AdminRoutineTemplateDayResource::collection($this->whenLoaded('days')),
        ];
    }
}
