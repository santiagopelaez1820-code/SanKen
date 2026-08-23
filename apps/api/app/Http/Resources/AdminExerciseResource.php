<?php

namespace App\Http\Resources;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Exercise */
class AdminExerciseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'primary_muscle_id' => $this->primary_muscle_id,
            'primary_muscle' => [
                'id' => $this->primaryMuscle->id,
                'name' => $this->primaryMuscle->name,
            ],
            'equipment' => $this->equipment,
            'level' => $this->level,
            'type' => $this->type,
            'instructions' => $this->instructions,
            'common_mistakes' => $this->common_mistakes,
            'tips' => $this->tips,
            'video_url' => $this->video_url,
            'image_url' => $this->image_url,
            'is_active' => $this->is_active,
            'alternatives' => $this->whenLoaded(
                'alternatives',
                fn () => $this->alternatives->map(fn ($alt) => ['id' => $alt->id, 'name' => $alt->name]),
            ),
        ];
    }
}
