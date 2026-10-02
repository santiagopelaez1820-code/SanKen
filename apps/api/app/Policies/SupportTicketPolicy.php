<?php

namespace App\Policies;

use App\Models\SupportTicket;
use App\Models\User;

/**
 * Un usuario solo ve y responde SUS solicitudes; el equipo de SanKen
 * (super_admin — no existe un rol de soporte aparte) ve y gestiona todas.
 * Los entrenadores NO tienen acceso: las solicitudes pueden contener cómo se
 * siente la persona entrenando o reclamos sobre su propio entrenador.
 */
class SupportTicketPolicy
{
    public function view(User $user, SupportTicket $ticket): bool
    {
        return $user->id === $ticket->user_id || $user->isAdmin();
    }

    /** El dueño puede escribir mientras la solicitud no esté cerrada. */
    public function reply(User $user, SupportTicket $ticket): bool
    {
        return $user->id === $ticket->user_id && ! $ticket->isClosed();
    }

    public function close(User $user, SupportTicket $ticket): bool
    {
        return $user->id === $ticket->user_id && ! $ticket->isClosed();
    }

    /** Responder como equipo, cambiar estado/prioridad/responsable. */
    public function manage(User $user, SupportTicket $ticket): bool
    {
        return $user->isAdmin();
    }
}
