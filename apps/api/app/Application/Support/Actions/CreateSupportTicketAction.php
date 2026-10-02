<?php

namespace App\Application\Support\Actions;

use App\Models\SupportTicket;
use App\Models\User;
use App\Models\WeeklyCheckin;
use App\Notifications\NewSupportActivityNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class CreateSupportTicketAction
{
    /**
     * Crea la solicitud con su primer mensaje (en una transacción: nunca
     * queda una solicitud sin mensaje) y avisa al equipo. Los reclamos entran
     * con prioridad 'high' para que se atiendan primero; el equipo puede
     * cambiarla después.
     *
     * @param  array<string, mixed>|null  $context
     */
    public function execute(
        User $user,
        string $type,
        string $subject,
        string $message,
        ?WeeklyCheckin $checkin = null,
        ?array $context = null,
    ): SupportTicket {
        $ticket = DB::transaction(function () use ($user, $type, $subject, $message, $checkin, $context) {
            $now = now();

            $ticket = SupportTicket::query()->create([
                'user_id' => $user->id,
                'type' => $type,
                'subject' => $subject,
                'status' => SupportTicket::STATUS_OPEN,
                'priority' => $type === 'complaint' ? 'high' : 'normal',
                'source' => $checkin ? SupportTicket::SOURCE_WEEKLY_CHECKIN : SupportTicket::SOURCE_APP,
                'weekly_checkin_id' => $checkin?->id,
                'context' => $context,
                'last_message_at' => $now,
                'last_message_by_staff' => false,
            ]);

            $ticket->messages()->create([
                'author_id' => $user->id,
                'is_staff' => false,
                'body' => $message,
            ]);

            return $ticket;
        });

        Notification::send(
            User::query()->where('role', 'super_admin')->where('id', '!=', $user->id)->get(),
            new NewSupportActivityNotification($ticket, NewSupportActivityNotification::EVENT_CREATED),
        );

        return $ticket;
    }
}
