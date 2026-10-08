<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las notificaciones.

namespace App\Notifications;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el trait que envía a la app y por push.
use App\Notifications\Concerns\SendsInAppAndPush;
// Esta línea sirve para importar la clase base de las notificaciones.
use Illuminate\Notifications\Notification;

/**
 * Al EQUIPO (super_admin): solicitud nueva o nueva respuesta del usuario.
 * Los reclamos y la prioridad alta/urgente se marcan en el título para que
 * se atiendan primero. Solo lleva asunto y tipo — nunca el texto del
 * mensaje (puede tener datos de cómo se siente la persona entrenando), que
 * se lee dentro del panel con la autorización correspondiente.
 */
// Esta línea sirve para declarar la notificación al equipo por actividad en una solicitud.
class NewSupportActivityNotification extends Notification
{
    // Esta línea sirve para usar el envío a la app y por push.
    use SendsInAppAndPush;

    // Esta línea sirve para definir el evento "solicitud creada".
    public const EVENT_CREATED = 'created';

    // Esta línea sirve para definir el evento "el usuario respondió".
    public const EVENT_USER_REPLIED = 'user_replied';

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir la solicitud.
        public readonly SupportTicket $ticket,
        // Esta línea sirve para recibir el evento.
        public readonly string $event,
    ) {}

    // Esta línea sirve para declarar el método que arma el contenido de la notificación.
    protected function payload(User $notifiable): array
    {
        // Esta línea sirve para elegir una marca para el título según la prioridad o el tipo.
        $flag = match (true) {
            // Esta línea sirve para marcar como urgente si la prioridad es urgente.
            $this->ticket->priority === 'urgent' => '🚨 Urgente · ',
            // Esta línea sirve para marcar como prioridad alta si es alta.
            $this->ticket->priority === 'high' => '⚠️ Prioridad alta · ',
            // Esta línea sirve para marcar como reclamo si es un reclamo.
            $this->ticket->type === 'complaint' => '⚠️ Reclamo · ',
            // Esta línea sirve para dejar sin marca los demás casos.
            default => '',
        };

        // Esta línea sirve para devolver el contenido.
        return [
            // Esta línea sirve para indicar el tipo de notificación.
            'kind' => 'support_ticket_staff',
            // Esta línea sirve para incluir el evento.
            'event' => $this->event,
            // Esta línea sirve para incluir el id de la solicitud.
            'ticket_id' => $this->ticket->id,
            // Esta línea sirve para armar el título con la marca según el evento.
            'title' => $flag.($this->event === self::EVENT_CREATED
                // Esta línea sirve para usar "Nueva solicitud #id" si es una solicitud nueva.
                ? "Nueva solicitud #{$this->ticket->id}"
                // Esta línea sirve para usar "Nueva respuesta en la solicitud #id" si respondió el usuario.
                : "Nueva respuesta en la solicitud #{$this->ticket->id}"),
            // Esta línea sirve para usar como texto el asunto recortado a 100 caracteres.
            'body' => str($this->ticket->subject)->limit(100)->toString(),
            // Esta línea sirve para incluir el enlace a la solicitud en el panel.
            'link' => "/admin/soporte/{$this->ticket->id}",
        ];
    }
}
