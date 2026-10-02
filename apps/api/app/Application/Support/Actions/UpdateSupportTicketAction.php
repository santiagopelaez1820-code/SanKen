<?php

namespace App\Application\Support\Actions;

use App\Models\SupportTicket;
use App\Notifications\SupportTicketUpdatedNotification;

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
    public function execute(SupportTicket $ticket, array $changes): SupportTicket
    {
        $previousStatus = $ticket->status;
        $updates = $changes;

        if (isset($changes['status']) && $changes['status'] !== $previousStatus) {
            match ($changes['status']) {
                // Resuelta: se registra cuándo (métrica "tiempo de resolución").
                SupportTicket::STATUS_RESOLVED => $updates += ['resolved_at' => now(), 'closed_at' => null],
                // Cerrada: se conserva resolved_at si ya estaba resuelta.
                SupportTicket::STATUS_CLOSED => $updates += ['closed_at' => now()],
                // Reabierta (abierta/en revisión/respondida): ya no cuenta como resuelta.
                default => $updates += ['resolved_at' => null, 'closed_at' => null],
            };
        }

        $ticket->update($updates);

        $closedOrResolved = [SupportTicket::STATUS_RESOLVED, SupportTicket::STATUS_CLOSED];
        if (isset($changes['status']) && $changes['status'] !== $previousStatus && in_array($changes['status'], $closedOrResolved, true)) {
            $ticket->user->notify(new SupportTicketUpdatedNotification($ticket, SupportTicketUpdatedNotification::EVENT_STATUS));
        }

        return $ticket->fresh();
    }
}
