<?php

namespace App\Http\Resources;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Report */
class ReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reporter' => [
                'id' => $this->reporter->id,
                'name' => $this->reporter->name,
            ],
            'reportable_type' => $this->reportable_type,
            'reportable_id' => $this->reportable_id,
            'reportable_preview' => $this->when(
                $this->reportable_type === 'chat_message' && $this->reportable,
                fn () => $this->reportable?->body,
            ),
            'reason' => $this->reason,
            'details' => $this->details,
            'status' => $this->status,
            'resolved_by' => $this->when($this->resolved_by, fn () => [
                'id' => $this->resolver->id,
                'name' => $this->resolver->name,
            ]),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'resolution_notes' => $this->resolution_notes,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
