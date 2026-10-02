<?php

namespace App\Http\Resources;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Misma forma para el usuario y para el equipo, pero lo interno (prioridad,
 * responsable, contexto del check-in, datos del usuario) solo va en la
 * vista del equipo — usar SupportTicketResource::forStaff().
 *
 * @mixin SupportTicket
 */
class SupportTicketResource extends JsonResource
{
    private bool $staffView = false;

    public static function forStaff(SupportTicket $ticket): static
    {
        $resource = new static($ticket);
        $resource->staffView = true;

        return $resource;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'subject' => $this->subject,
            'status' => $this->status,
            'source' => $this->source,
            'weekly_checkin_id' => $this->weekly_checkin_id,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'last_message_by_staff' => $this->last_message_by_staff,
            'first_response_at' => $this->first_response_at?->toIso8601String(),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(fn (SupportTicketMessage $message) => [
                'id' => $message->id,
                'body' => $message->body,
                'is_staff' => $message->is_staff,
                // Al usuario se le muestra "Equipo SanKen", no el nombre de
                // quién respondió; el equipo sí ve el nombre.
                'author_name' => $message->is_staff && ! $this->staffView
                    ? null
                    : $message->author?->name,
                'created_at' => $message->created_at?->toIso8601String(),
            ])->values()),
            $this->mergeWhen($this->staffView, fn () => [
                'priority' => $this->priority,
                'context' => $this->context,
                'user' => $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ] : null,
                'assignee' => $this->assignee ? ['id' => $this->assignee->id, 'name' => $this->assignee->name] : null,
            ]),
        ];
    }
}
