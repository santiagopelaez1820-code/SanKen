<?php

namespace App\Http\Resources;

use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Achievement */
class AchievementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'xp_bonus' => $this->xp_bonus,
            'unlocked' => $this->whenPivotLoaded('user_achievements', fn () => true, false),
            'achieved_at' => $this->whenPivotLoaded('user_achievements', fn () => $this->pivot->achieved_at?->toIso8601String(), null),
        ];
    }
}
