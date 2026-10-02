<?php

namespace App\Http\Resources;

use App\Models\WeeklyCheckin;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WeeklyCheckin */
class WeeklyCheckinResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'week' => $this->week,
            'status' => $this->status,
            'mood' => $this->mood,
            'topic' => $this->topic,
            'postpone_count' => $this->postpone_count,
            'answered_at' => $this->answered_at?->toIso8601String(),
            'support_ticket_id' => $this->supportTicket?->id,
        ];
    }
}
