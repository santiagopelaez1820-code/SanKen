<?php

namespace App\Http\Resources;

use App\Models\UserConsent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin UserConsent */
class UserConsentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'consent_type' => $this->consent_type,
            'document_version' => $this->document_version,
            'status' => $this->status,
            'source' => $this->source,
            'recorded_at' => $this->recorded_at?->toIso8601String(),
        ];
    }
}
