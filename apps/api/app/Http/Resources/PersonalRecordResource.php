<?php

namespace App\Http\Resources;

use App\Models\PersonalRecord;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PersonalRecord */
class PersonalRecordResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'exercise_id' => $this->exercise_id,
            'exercise_name' => $this->whenLoaded('exercise', fn () => $this->exercise->name),
            'record_type' => $this->record_type,
            'value' => (float) $this->value,
            'achieved_at' => $this->achieved_at?->toDateString(),
        ];
    }
}
