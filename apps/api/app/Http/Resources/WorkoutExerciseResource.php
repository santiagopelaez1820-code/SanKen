<?php

namespace App\Http\Resources;

use App\Models\WorkoutExercise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkoutExercise */
class WorkoutExerciseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order' => $this->order,
            'all_sets_completed' => $this->all_sets_completed,
            'target_sets' => $this->target_sets,
            'target_reps' => $this->target_reps,
            'rest_seconds' => $this->rest_seconds,
            'target_rpe' => $this->target_rpe,
            'suggested_weight_kg' => $this->suggested_weight_kg,
            'suggested_reps_per_set' => $this->suggested_reps_per_set,
            'exercise' => [
                'id' => $this->exercise->id,
                'name' => $this->exercise->name,
                'primary_muscle' => $this->exercise->primaryMuscle->name,
                'equipment' => $this->exercise->equipment,
                'video_url' => $this->exercise->video_url,
                'image_url' => $this->exercise->image_url,
            ],
            'alternative' => $this->exercise->relationLoaded('alternatives')
                ? RoutineExerciseResource::summarize($this->exercise->alternatives->first())
                : null,
            'sets' => WorkoutSetResource::collection($this->whenLoaded('sets')),
        ];
    }
}
