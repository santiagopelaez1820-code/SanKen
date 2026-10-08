<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

/**
 * Un usuario solo ve y responde SUS solicitudes; el equipo de SanKen
 * (super_admin — no existe un rol de soporte aparte) ve y gestiona todas.
 * Los entrenadores NO tienen acceso: las solicitudes pueden contener cómo se
 * siente la persona entrenando o reclamos sobre su propio entrenador.
 */
// Esta línea sirve para declarar la policy de las solicitudes de soporte.
class SupportTicketPolicy
{
    // Esta línea sirve para declarar el permiso para ver una solicitud.
    public function view(User $user, SupportTicket $ticket): bool
    {
        // Esta línea sirve para permitirlo si es del usuario o si es super admin.
        return $user->id === $ticket->user_id || $user->isAdmin();
    }

    /** El dueño puede escribir mientras la solicitud no esté cerrada. */
    // Esta línea sirve para declarar el permiso para responder una solicitud.
    public function reply(User $user, SupportTicket $ticket): bool
    {
        // Esta línea sirve para permitirlo si es del usuario y no está cerrada.
        return $user->id === $ticket->user_id && ! $ticket->isClosed();
    }

    // Esta línea sirve para declarar el permiso para cerrar una solicitud.
    public function close(User $user, SupportTicket $ticket): bool
    {
        // Esta línea sirve para permitirlo si es del usuario y no está cerrada.
        return $user->id === $ticket->user_id && ! $ticket->isClosed();
    }

    /** Responder como equipo, cambiar estado/prioridad/responsable. */
    // Esta línea sirve para declarar el permiso para gestionarla como equipo.
    public function manage(User $user, SupportTicket $ticket): bool
    {
        // Esta línea sirve para permitirlo solo a super admin.
        return $user->isAdmin();
    }
}
