<?php

namespace App\Http\Resources;

use App\Models\BodyMeasurement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BodyMeasurement */
class BodyMeasurementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'measured_at' => $this->measured_at?->toDateString(),
            'weight_kg' => $this->weight_kg !== null ? (float) $this->weight_kg : null,
            'body_fat_pct' => $this->body_fat_pct !== null ? (float) $this->body_fat_pct : null,
            'chest_cm' => $this->chest_cm !== null ? (float) $this->chest_cm : null,
            'waist_cm' => $this->waist_cm !== null ? (float) $this->waist_cm : null,
            'hip_cm' => $this->hip_cm !== null ? (float) $this->hip_cm : null,
            'arm_cm' => $this->arm_cm !== null ? (float) $this->arm_cm : null,
            'thigh_cm' => $this->thigh_cm !== null ? (float) $this->thigh_cm : null,
            'progress_photo_url' => $this->progress_photo_url,
        ];
    }
}
