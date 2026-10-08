<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de soporte.

namespace App\Application\Support\Actions;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar la notificación de actividad nueva para el equipo.
use App\Notifications\NewSupportActivityNotification;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Notification para enviar notificaciones a varios usuarios.
use Illuminate\Support\Facades\Notification;

// Esta línea sirve para declarar la acción que crea una solicitud de soporte.
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
    // Esta línea sirve para declarar el método que crea la solicitud.
    public function execute(
        // Esta línea sirve para recibir el usuario que la crea.
        User $user,
        // Esta línea sirve para recibir el tipo de solicitud.
        string $type,
        // Esta línea sirve para recibir el asunto.
        string $subject,
        // Esta línea sirve para recibir el primer mensaje.
        string $message,
        // Esta línea sirve para recibir el check-in que la originó, si aplica.
        ?WeeklyCheckin $checkin = null,
        // Esta línea sirve para recibir datos de contexto adicionales, si los hay.
        ?array $context = null,
        // Esta línea sirve para indicar que el método devuelve la solicitud creada.
    ): SupportTicket {
        // Esta línea sirve para crear la solicitud y su primer mensaje dentro de una transacción.
        $ticket = DB::transaction(function () use ($user, $type, $subject, $message, $checkin, $context) {
            // Esta línea sirve para guardar la fecha y hora actual.
            $now = now();

            // Esta línea sirve para crear la solicitud con los siguientes datos.
            $ticket = SupportTicket::query()->create([
                // Esta línea sirve para guardar el id del usuario.
                'user_id' => $user->id,
                // Esta línea sirve para guardar el tipo.
                'type' => $type,
                // Esta línea sirve para guardar el asunto.
                'subject' => $subject,
                // Esta línea sirve para dejarla en estado abierta.
                'status' => SupportTicket::STATUS_OPEN,
                // Esta línea sirve para dar prioridad alta a los reclamos y normal al resto.
                'priority' => $type === 'complaint' ? 'high' : 'normal',
                // Esta línea sirve para guardar el origen: check-in semanal o la app.
                'source' => $checkin ? SupportTicket::SOURCE_WEEKLY_CHECKIN : SupportTicket::SOURCE_APP,
                // Esta línea sirve para guardar el id del check-in, si existe.
                'weekly_checkin_id' => $checkin?->id,
                // Esta línea sirve para guardar el contexto adicional.
                'context' => $context,
                // Esta línea sirve para guardar la fecha del último mensaje.
                'last_message_at' => $now,
                // Esta línea sirve para indicar que el último mensaje no es del equipo.
                'last_message_by_staff' => false,
            ]);

            // Esta línea sirve para crear el primer mensaje de la solicitud.
            $ticket->messages()->create([
                // Esta línea sirve para guardar el autor del mensaje.
                'author_id' => $user->id,
                // Esta línea sirve para indicar que el mensaje no es del equipo.
                'is_staff' => false,
                // Esta línea sirve para guardar el texto del mensaje.
                'body' => $message,
            ]);

            // Esta línea sirve para devolver la solicitud creada desde la transacción.
            return $ticket;
        });

        // Esta línea sirve para enviar una notificación.
        Notification::send(
            // Esta línea sirve para elegir como destinatarios a todos los super admins excepto el propio usuario.
            User::query()->where('role', 'super_admin')->where('id', '!=', $user->id)->get(),
            // Esta línea sirve para avisar que se creó una solicitud nueva.
            new NewSupportActivityNotification($ticket, NewSupportActivityNotification::EVENT_CREATED),
        );

        // Esta línea sirve para devolver la solicitud creada.
        return $ticket;
    }
}
