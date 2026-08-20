<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class OnboardingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->profile;
        $onboarding = $this->onboardingResponse;

        return [
            'age' => $profile?->age,
            'sex' => $profile?->sex,
            'height_cm' => $profile?->height_cm,
            'weight_kg' => $profile?->weight_kg,
            'city_id' => $profile?->city_id,
            // Derivados, no columnas propias — igual que en RankingScopeResolver: el
            // perfil solo guarda city_id, país/depto se resuelven hacia arriba.
            'state_id' => $profile?->city?->state_id,
            'country_id' => $profile?->city?->country_id,
            'gym_id' => $profile?->gym_id,

            'level' => $onboarding?->level,
            'goals' => $onboarding?->goals ?? [],
            'frequency_days' => $onboarding?->frequency_days,
            'equipment_available' => $onboarding?->equipment_available ?? [],

            'completed' => (bool) $onboarding?->completed,
            'completed_at' => $onboarding?->completed_at?->toIso8601String(),
        ];
    }
}
