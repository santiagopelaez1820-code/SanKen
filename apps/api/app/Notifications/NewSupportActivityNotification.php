<?php

namespace App\Notifications;

use App\Models\SupportTicket;
use App\Models\User;
use App\Notifications\Concerns\SendsInAppAndPush;
use Illuminate\Notifications\Notification;

/**
 * Al EQUIPO (super_admin): solicitud nueva o nueva respuesta del usuario.
 * Los reclamos y la prioridad alta/urgente se marcan en el título para que
 * se atiendan primero. Solo lleva asunto y tipo — nunca el texto del
 * mensaje (puede tener datos de cómo se siente la persona entrenando), que
 * se lee dentro del panel con la autorización correspondiente.
 */
class NewSupportActivityNotification extends Notification
{
    use SendsInAppAndPush;

    public const EVENT_CREATED = 'created';

    public const EVENT_USER_REPLIED = 'user_replied';

    public function __construct(
        public readonly SupportTicket $ticket,
        public readonly string $event,
    ) {}

    protected function payload(User $notifiable): array
    {
        $flag = match (true) {
            $this->ticket->priority === 'urgent' => '🚨 Urgente · ',
            $this->ticket->priority === 'high' => '⚠️ Prioridad alta · ',
            $this->ticket->type === 'complaint' => '⚠️ Reclamo · ',
            default => '',
        };

        return [
            'kind' => 'support_ticket_staff',
            'event' => $this->event,
            'ticket_id' => $this->ticket->id,
            'title' => $flag.($this->event === self::EVENT_CREATED
                ? "Nueva solicitud #{$this->ticket->id}"
                : "Nueva respuesta en la solicitud #{$this->ticket->id}"),
            'body' => str($this->ticket->subject)->limit(100)->toString(),
            'link' => "/admin/soporte/{$this->ticket->id}",
        ];
    }
}
