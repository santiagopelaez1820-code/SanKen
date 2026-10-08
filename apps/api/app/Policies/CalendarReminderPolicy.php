<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo CalendarReminder (recordatorio).
use App\Models\CalendarReminder;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de los recordatorios del calendario.
class CalendarReminderPolicy
{
    // Esta línea sirve para declarar el permiso para borrar un recordatorio.
    public function delete(User $user, CalendarReminder $reminder): bool
    {
        // Esta línea sirve para permitirlo solo si el recordatorio es del usuario.
        return $user->id === $reminder->user_id;
    }
}
