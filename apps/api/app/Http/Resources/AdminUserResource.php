<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class AdminUserResource extends JsonResource
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
            'role' => $this->role,
            'is_banned' => $this->is_banned,
            'is_deactivated' => $this->deactivated_at !== null,
            'country' => $this->profile?->city?->country?->name,
            'state' => $this->profile?->city?->state?->name,
            'city' => $this->profile?->city?->name,
            'trainer_verified_at' => $this->trainer_verified_at?->toIso8601String(),
            'last_active_at' => $this->last_active_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'current_routine' => $this->currentRoutineSummary(),
        ];
    }

    /**
     * @return array{id: int, source: string, frequency_days: int, label: string}|null
     */
    private function currentRoutineSummary(): ?array
    {
        $active = $this->relationLoaded('routines')
            ? $this->routines->firstWhere('is_active', true)
            : $this->routines()->where('is_active', true)->first();

        if (! $active) {
            return null;
        }

        return [
            'id' => $active->id,
            'source' => $active->source,
            'frequency_days' => $active->frequency_days,
            'label' => match ($active->source) {
                'admin' => 'Personalizada',
                'trainer' => 'Asignada por entrenador',
                default => "General {$active->frequency_days} días",
            },
        ];
    }
}
