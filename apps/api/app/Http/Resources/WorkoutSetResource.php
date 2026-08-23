<?php

namespace App\Http\Resources;

use App\Models\WorkoutSet;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkoutSet */
class WorkoutSetResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'set_number' => $this->set_number,
            'weight_kg' => (float) $this->weight_kg,
            'reps' => $this->reps,
            'rpe' => $this->rpe !== null ? (float) $this->rpe : null,
            'is_warmup' => $this->is_warmup,
            'completed' => $this->completed,
        ];
    }
}
