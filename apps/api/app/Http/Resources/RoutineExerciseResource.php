<?php

namespace App\Http\Resources;

use App\Models\Exercise;
use App\Models\RoutineExercise;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineExercise */
class RoutineExerciseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order' => $this->order,
            'exercise' => [
                'id' => $this->exercise->id,
                'name' => $this->exercise->name,
                'primary_muscle' => $this->exercise->primaryMuscle->name,
                'equipment' => $this->exercise->equipment,
                'video_url' => $this->exercise->video_url,
                'image_url' => $this->exercise->image_url,
            ],
            // Presente solo si el ejercicio tiene una alternativa A/B sembrada
            // (ver RoutineTemplateSeeder / exercise_alternatives) — el
            // frontend usa esto para decidir si mostrar "Cambiar ejercicio".
            'alternative' => $this->exercise->relationLoaded('alternatives')
                ? self::summarize($this->exercise->alternatives->first())
                : null,
            'target_sets' => $this->target_sets,
            'target_reps' => $this->target_reps,
            'rest_seconds' => $this->rest_seconds,
            'target_rpe' => $this->target_rpe,
            'suggested_weight_kg' => $this->suggested_weight_kg,
            'suggested_reps_per_set' => $this->suggested_reps_per_set,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function summarize(?Exercise $exercise): ?array
    {
        if (! $exercise) {
            return null;
        }

        return [
            'id' => $exercise->id,
            'name' => $exercise->name,
            'primary_muscle' => $exercise->primaryMuscle->name,
            'equipment' => $exercise->equipment,
            'video_url' => $exercise->video_url,
            'image_url' => $exercise->image_url,
        ];
    }
}
