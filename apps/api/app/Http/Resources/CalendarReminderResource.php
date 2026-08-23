<?php

namespace App\Http\Resources;

use App\Models\CalendarReminder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CalendarReminder */
class CalendarReminderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'reminder',
            'event_date' => $this->event_date->toDateString(),
            'title' => $this->title,
            'notes' => $this->notes,
        ];
    }
}
