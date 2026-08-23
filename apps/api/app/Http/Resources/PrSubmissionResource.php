<?php

namespace App\Http\Resources;

use App\Models\PrSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PrSubmission */
class PrSubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'exercise' => [
                'id' => $this->exercise->id,
                'name' => $this->exercise->name,
            ],
            'weight_kg' => $this->weight_kg,
            'reps' => $this->reps,
            'estimated_1rm' => $this->estimated_1rm,
            'video_url' => $this->video_url,
            'status' => $this->status,
            'reviewed_by' => $this->when($this->reviewed_by, fn () => [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ]),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
