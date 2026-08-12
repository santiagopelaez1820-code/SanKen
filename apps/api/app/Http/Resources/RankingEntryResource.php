<?php

namespace App\Http\Resources;

use App\Models\RankingSnapshot;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RankingSnapshot */
class RankingEntryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'rank' => $this->rank_position,
            'user_id' => $this->user_id,
            'user_name' => $this->user->name,
            'metric_value' => (float) $this->metric_value,
            'is_viewer' => $this->user_id === $request->user()?->id,
        ];
    }
}
