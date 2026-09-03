<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'role' => $this->role,
            'two_factor_enabled' => $this->two_factor_enabled,
            'is_public_profile' => $this->is_public_profile,
            'trainer_verified_at' => $this->trainer_verified_at?->toIso8601String(),
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'onboarding_completed' => (bool) $this->onboardingResponse?->completed,
            'has_location' => (bool) $this->profile?->city_id,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
