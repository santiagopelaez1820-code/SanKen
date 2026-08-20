<?php

namespace App\Http\Resources;

use App\Models\RoutineTemplateExercise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplateExercise */
class AdminRoutineTemplateExerciseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order' => $this->order,
            'exercise_id' => $this->exercise_id,
            'exercise' => [
                'id' => $this->exercise->id,
                'name' => $this->exercise->name,
                'primary_muscle' => $this->exercise->primaryMuscle->name,
                'equipment' => $this->exercise->equipment,
            ],
            'default_sets' => $this->default_sets,
            'default_reps' => $this->default_reps,
            'rest_seconds' => $this->rest_seconds,
            'default_rpe' => $this->default_rpe !== null ? (float) $this->default_rpe : null,
        ];
    }
}
