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
 * Al USUARIO dueño de la solicitud: el equipo respondió, o la marcó como
 * resuelta/cerrada. Sin ShouldQueue (mismo criterio que el chat: tiene que
 * aparecer en Novedades en el mismo request, sin depender de queue:work).
 * El correo de la respuesta va aparte (SupportReplyMailNotification, en cola).
 */
// Esta línea sirve para declarar la notificación al usuario cuando su solicitud cambia.
class SupportTicketUpdatedNotification extends Notification
{
    // Esta línea sirve para usar el envío a la app y por push.
    use SendsInAppAndPush;

    // Esta línea sirve para definir el evento "el equipo respondió".
    public const EVENT_REPLIED = 'replied';

    // Esta línea sirve para definir el evento "cambió el estado".
    public const EVENT_STATUS = 'status_changed';

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
        // Esta línea sirve para guardar el número de la solicitud.
        $number = $this->ticket->id;

        // Esta línea sirve para devolver el contenido.
        return [
            // Esta línea sirve para indicar el tipo de notificación.
            'kind' => 'support_ticket',
            // Esta línea sirve para incluir el evento.
            'event' => $this->event,
            // Esta línea sirve para incluir el id de la solicitud.
            'ticket_id' => $this->ticket->id,
            // Esta línea sirve para incluir el estado.
            'status' => $this->ticket->status,
            // Esta línea sirve para elegir el título según el evento.
            'title' => $this->event === self::EVENT_REPLIED
                // Esta línea sirve para usar "Respuesta a tu solicitud #número" si respondió el equipo.
                ? "Respuesta a tu solicitud #{$number}"
                // Esta línea sirve para usar "Tu solicitud #número fue actualizada" si cambió el estado.
                : "Tu solicitud #{$number} fue actualizada",
            // Esta línea sirve para elegir el texto según el evento.
            'body' => $this->event === self::EVENT_REPLIED
                // Esta línea sirve para avisar que respondió el equipo con el asunto recortado.
                ? 'El equipo de SanKen respondió: '.str($this->ticket->subject)->limit(80)
                // Esta línea sirve para usar el asunto recortado a 100 caracteres en los demás casos.
                : str($this->ticket->subject)->limit(100)->toString(),
            // Esta línea sirve para incluir el enlace a la solicitud.
            'link' => "/soporte/{$this->ticket->id}",
        ];
    }
}
