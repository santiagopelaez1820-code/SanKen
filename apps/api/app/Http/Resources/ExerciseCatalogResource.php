<?php

namespace App\Http\Resources;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Exercise */
class ExerciseCatalogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'primary_muscle' => [
                'id' => $this->primaryMuscle->id,
                'name' => $this->primaryMuscle->name,
                'slug' => $this->primaryMuscle->slug,
            ],
            'equipment' => $this->equipment,
            'level' => $this->level,
            'type' => $this->type,
        ];
    }
}
