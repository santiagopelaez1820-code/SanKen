<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de soporte.

namespace App\Application\Support\Actions;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo SupportTicketMessage (mensaje de una solicitud).
use App\Models\SupportTicketMessage;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la notificación de actividad nueva para el equipo de soporte.
use App\Notifications\NewSupportActivityNotification;
// Esta línea sirve para importar la notificación por correo de respuesta del equipo.
use App\Notifications\SupportReplyMailNotification;
// Esta línea sirve para importar la notificación de solicitud actualizada para el usuario.
use App\Notifications\SupportTicketUpdatedNotification;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Notification para enviar notificaciones a varios usuarios.
use Illuminate\Support\Facades\Notification;

// Esta línea sirve para declarar la acción que agrega un mensaje a una solicitud de soporte.
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
    // Esta línea sirve para declarar el método que recibe la solicitud, el autor, el texto y si es del equipo.
    public function execute(SupportTicket $ticket, User $author, string $body, bool $asStaff): SupportTicketMessage
    {
        // Esta línea sirve para crear el mensaje y actualizar la solicitud dentro de una transacción.
        $message = DB::transaction(function () use ($ticket, $author, $body, $asStaff) {
            // Esta línea sirve para guardar la fecha y hora actual.
            $now = now();

            // Esta línea sirve para crear el mensaje dentro de la solicitud.
            $message = $ticket->messages()->create([
                // Esta línea sirve para guardar quién escribió el mensaje.
                'author_id' => $author->id,
                // Esta línea sirve para indicar si el mensaje es del equipo de soporte.
                'is_staff' => $asStaff,
                // Esta línea sirve para guardar el texto del mensaje.
                'body' => $body,
            ]);

            // Esta línea sirve para preparar los cambios: fecha del último mensaje y si fue del equipo.
            $updates = ['last_message_at' => $now, 'last_message_by_staff' => $asStaff];

            // Esta línea sirve para revisar si el mensaje es del equipo.
            if ($asStaff) {
                // Esta línea sirve para marcar la solicitud como respondida.
                $updates['status'] = SupportTicket::STATUS_ANSWERED;
                // Esta línea sirve para guardar la fecha de la primera respuesta si todavía no había.
                $updates['first_response_at'] = $ticket->first_response_at ?? $now;
                // Esta línea sirve para manejar el caso de un mensaje del usuario sobre una solicitud respondida o resuelta.
            } elseif (in_array($ticket->status, [SupportTicket::STATUS_ANSWERED, SupportTicket::STATUS_RESOLVED], true)) {
                // Esta línea sirve para volver a abrir la solicitud.
                $updates['status'] = SupportTicket::STATUS_OPEN;
                // Esta línea sirve para borrar la fecha de resolución.
                $updates['resolved_at'] = null;
            }

            // Esta línea sirve para guardar los cambios en la solicitud.
            $ticket->update($updates);

            // Esta línea sirve para devolver el mensaje creado.
            return $message;
        });

        // Esta línea sirve para revisar si el mensaje es del equipo.
        if ($asStaff) {
            // Esta línea sirve para notificar al usuario que su solicitud fue respondida.
            $ticket->user->notify(new SupportTicketUpdatedNotification($ticket, SupportTicketUpdatedNotification::EVENT_REPLIED));
            // Esta línea sirve para enviar además un correo al usuario con la respuesta.
            $ticket->user->notify(new SupportReplyMailNotification($ticket));
            // Esta línea sirve para manejar el caso de un mensaje del usuario.
        } else {
            // Si está asignada, avisa solo al responsable; si no, a todo el equipo.
            // Esta línea sirve para avisar al responsable asignado, si hay uno.
            $staff = $ticket->assignee
                // Esta línea sirve para armar una lista con solo el responsable.
                ? collect([$ticket->assignee])
                // Esta línea sirve para avisar a todo el equipo menos al autor si no hay responsable.
                : User::query()->where('role', 'super_admin')->where('id', '!=', $author->id)->get();

            // Esta línea sirve para enviar la notificación de actividad nueva al equipo.
            Notification::send($staff, new NewSupportActivityNotification($ticket, NewSupportActivityNotification::EVENT_USER_REPLIED));
        }

        // Esta línea sirve para devolver el mensaje creado.
        return $message;
    }
}
