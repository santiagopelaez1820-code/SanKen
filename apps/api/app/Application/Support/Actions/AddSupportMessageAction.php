<?php

namespace App\Application\Support\Actions;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\User;
use App\Notifications\NewSupportActivityNotification;
use App\Notifications\SupportReplyMailNotification;
use App\Notifications\SupportTicketUpdatedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class AddSupportMessageAction
{
    /**
     * Agrega un mensaje a la conversación y ajusta el estado:
     * - respuesta del equipo → 'answered' (y registra la primera respuesta);
     * - mensaje del usuario sobre una solicitud respondida/resuelta → vuelve a
     *   'open' (el equipo tiene algo pendiente otra vez).
     * La autorización (quién puede escribir y en qué estado) la resuelve
     * SupportTicketPolicy antes de llegar acá.
     */
    public function execute(SupportTicket $ticket, User $author, string $body, bool $asStaff): SupportTicketMessage
    {
        $message = DB::transaction(function () use ($ticket, $author, $body, $asStaff) {
            $now = now();

            $message = $ticket->messages()->create([
                'author_id' => $author->id,
                'is_staff' => $asStaff,
                'body' => $body,
            ]);

            $updates = ['last_message_at' => $now, 'last_message_by_staff' => $asStaff];

            if ($asStaff) {
                $updates['status'] = SupportTicket::STATUS_ANSWERED;
                $updates['first_response_at'] = $ticket->first_response_at ?? $now;
            } elseif (in_array($ticket->status, [SupportTicket::STATUS_ANSWERED, SupportTicket::STATUS_RESOLVED], true)) {
                $updates['status'] = SupportTicket::STATUS_OPEN;
                $updates['resolved_at'] = null;
            }

            $ticket->update($updates);

            return $message;
        });

        if ($asStaff) {
            $ticket->user->notify(new SupportTicketUpdatedNotification($ticket, SupportTicketUpdatedNotification::EVENT_REPLIED));
            $ticket->user->notify(new SupportReplyMailNotification($ticket));
        } else {
            // Si está asignada, avisa solo al responsable; si no, a todo el equipo.
            $staff = $ticket->assignee
                ? collect([$ticket->assignee])
                : User::query()->where('role', 'super_admin')->where('id', '!=', $author->id)->get();

            Notification::send($staff, new NewSupportActivityNotification($ticket, NewSupportActivityNotification::EVENT_USER_REPLIED));
        }

        return $message;
    }
}
