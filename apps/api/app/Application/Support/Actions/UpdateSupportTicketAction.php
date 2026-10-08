<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de soporte.

namespace App\Application\Support\Actions;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar la notificación de solicitud actualizada para el usuario.
use App\Notifications\SupportTicketUpdatedNotification;

// Esta línea sirve para declarar la acción que aplica cambios de gestión a una solicitud.
class UpdateSupportTicketAction
{
    /**
     * Cambios de gestión hechos por el equipo: estado, prioridad y
     * responsable. Solo se avisa al usuario cuando su solicitud pasa a
     * resuelta o cerrada — prioridad y asignación son internas y cambiar a
     * "en revisión" no merece una notificación.
     *
     * @param  array{status?: string, priority?: string, assigned_to?: int|null}  $changes
     */
    // Esta línea sirve para declarar el método que recibe la solicitud y los cambios.
    public function execute(SupportTicket $ticket, array $changes): SupportTicket
    {
        // Esta línea sirve para guardar el estado que tenía antes del cambio.
        $previousStatus = $ticket->status;
        // Esta línea sirve para empezar con los cambios recibidos.
        $updates = $changes;

        // Esta línea sirve para revisar si cambia el estado.
        if (isset($changes['status']) && $changes['status'] !== $previousStatus) {
            // Esta línea sirve para elegir qué fechas ajustar según el estado nuevo.
            match ($changes['status']) {
                // Resuelta: se registra cuándo (métrica "tiempo de resolución").
                // Esta línea sirve para guardar la fecha de resolución y quitar la de cierre si queda resuelta.
                SupportTicket::STATUS_RESOLVED => $updates += ['resolved_at' => now(), 'closed_at' => null],
                // Cerrada: se conserva resolved_at si ya estaba resuelta.
                // Esta línea sirve para guardar la fecha de cierre si queda cerrada.
                SupportTicket::STATUS_CLOSED => $updates += ['closed_at' => now()],
                // Reabierta (abierta/en revisión/respondida): ya no cuenta como resuelta.
                // Esta línea sirve para borrar las fechas de resolución y cierre si se reabre.
                default => $updates += ['resolved_at' => null, 'closed_at' => null],
            };
        }

        // Esta línea sirve para guardar los cambios en la solicitud.
        $ticket->update($updates);

        // Esta línea sirve para definir los estados que cuentan como resuelta o cerrada.
        $closedOrResolved = [SupportTicket::STATUS_RESOLVED, SupportTicket::STATUS_CLOSED];
        // Esta línea sirve para revisar si el estado cambió a resuelta o cerrada.
        if (isset($changes['status']) && $changes['status'] !== $previousStatus && in_array($changes['status'], $closedOrResolved, true)) {
            // Esta línea sirve para notificar al usuario el cambio de estado de su solicitud.
            $ticket->user->notify(new SupportTicketUpdatedNotification($ticket, SupportTicketUpdatedNotification::EVENT_STATUS));
        }

        // Esta línea sirve para devolver la solicitud recargada.
        return $ticket->fresh();
    }
}
