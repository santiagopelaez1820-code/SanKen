<?php

namespace App\Notifications;

use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\Concerns\SendsInAppAndPush;
use Illuminate\Notifications\Notification;

/**
 * Al USUARIO dueño de la solicitud: el equipo respondió, o la marcó como
 * resuelta/cerrada. Sin ShouldQueue (mismo criterio que el chat: tiene que
 * aparecer en Novedades en el mismo request, sin depender de queue:work).
 * El correo de la respuesta va aparte (SupportReplyMailNotification, en cola).
 */
class SupportTicketUpdatedNotification extends Notification
{
    use SendsInAppAndPush;

    public const EVENT_REPLIED = 'replied';

    public const EVENT_STATUS = 'status_changed';

    public function __construct(
        public readonly SupportTicket $ticket,
        public readonly string $event,
    ) {}

    protected function payload(User $notifiable): array
    {
        $number = $this->ticket->id;

        return [
            'kind' => 'support_ticket',
            'event' => $this->event,
            'ticket_id' => $this->ticket->id,
            'status' => $this->ticket->status,
            'title' => $this->event === self::EVENT_REPLIED
                ? "Respuesta a tu solicitud #{$number}"
                : "Tu solicitud #{$number} fue actualizada",
            'body' => $this->event === self::EVENT_REPLIED
                ? 'El equipo de SanKen respondió: '.str($this->ticket->subject)->limit(80)
                : str($this->ticket->subject)->limit(100)->toString(),
            'link' => "/soporte/{$this->ticket->id}",
        ];
    }
}
