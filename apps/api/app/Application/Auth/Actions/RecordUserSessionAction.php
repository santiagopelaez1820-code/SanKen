<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de autenticación.

namespace App\Application\Auth\Actions;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo que guarda eventos de actividad del usuario.
use App\Models\UserActivityEvent;
// Esta línea sirve para importar la clase Request para saber desde dónde llegó la petición.
use Illuminate\Http\Request;

/**
 * Registra un "ingreso" real (login por password, social, 2FA completado, o
 * un registro que loguea automático) para la Analítica de uso del Super
 * Admin — ver AdminAnalyticsController. A diferencia del heartbeat de
 * TouchLastActive (throttleado a 1/hora), acá SIEMPRE se inserta una fila:
 * si el mismo usuario entra 5 veces hoy, son 5 sesiones (no se deduplica),
 * aunque sigue contando como 1 sólo usuario activo (esa cuenta usa
 * COUNT DISTINCT sobre user_id, no importa cuántas filas tenga).
 */
// Esta línea sirve para declarar la acción que registra un inicio de sesión para la analítica.
class RecordUserSessionAction
{
    // Esta línea sirve para declarar el método que recibe al usuario y la petición.
    public function execute(User $user, Request $request): void
    {
        // Esta línea sirve para guardar la fecha y hora actual.
        $now = now();

        // Esta línea sirve para crear el evento de actividad en la base de datos.
        UserActivityEvent::query()->create([
            // Esta línea sirve para guardar el id del usuario que inició sesión.
            'user_id' => $user->id,
            // Esta línea sirve para marcar el evento como un inicio de sesión.
            'event_type' => UserActivityEvent::TYPE_LOGIN,
            // Esta línea sirve para guardar la plataforma: web si la petición trae sesión, si no móvil.
            'platform' => $request->hasSession() ? UserActivityEvent::PLATFORM_WEB : UserActivityEvent::PLATFORM_MOBILE,
            // Esta línea sirve para guardar el momento exacto del inicio de sesión.
            'occurred_at' => $now,
            // Esta línea sirve para guardar solo la fecha para agrupar por día.
            'activity_date' => $now->toDateString(),
        ]);
    }
}
