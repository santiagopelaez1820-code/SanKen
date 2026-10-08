<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los middleware.

namespace App\Http\Middleware;

// Esta línea sirve para importar el modelo UserActivityEvent (evento de actividad del usuario).
use App\Models\UserActivityEvent;
// Esta línea sirve para importar Closure para recibir el siguiente paso de la petición.
use Closure;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase Response de Symfony para tipar la respuesta.
use Symfony\Component\HttpFoundation\Response;

/**
 * Alimenta:
 * 1. users.last_active_at — snapshot puntual usado por GlobalMetricsCalculator
 *    (DAU/WAU/MAU "rolling") y por el indicador de "en línea". Throttleado a
 *    como mucho 1 escritura cada 5 minutos por usuario para no pegarle a la
 *    DB en cada request autenticada.
 * 2. user_activity_events (event_type=heartbeat) — historial liviano para la
 *    Analítica de uso del Super Admin (ver UsageAnalyticsCalculator), que sí
 *    necesita saber EN QUÉ hora/día pasó cada cosa, no solo la última. Se
 *    throttlea aparte, a como mucho 1 fila por usuario por hora-calendario.
 *
 *    Reusa `last_active_at` (ya cargado) en vez de una query extra para
 *    decidir si ya hay fila de esta hora — pero para que esa comparación seas
 *    confiable, `last_active_at` tiene que quedar SIEMPRE al día apenas
 *    cambia la hora, aunque no se hayan cumplido los 5 minutos del otro
 *    throttle: si no, una request 1 minuto después de cruzar la hora vuelve a
 *    ver el valor de la hora anterior (`last_active_at` "atrasado" por su
 *    propio throttle) y creería que todavía no insertó la fila de esta hora,
 *    insertando duplicados hasta que ese throttle alcance a ponerse al día.
 */
// Esta línea sirve para declarar el middleware que registra la última actividad del usuario.
class TouchLastActive
{
    // Esta línea sirve para declarar el método que procesa cada petición.
    public function handle(Request $request, Closure $next): Response
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para revisar si hay usuario.
        if ($user) {
            // Esta línea sirve para guardar la fecha y hora actual.
            $now = now();
            // Esta línea sirve para leer la última actividad registrada.
            $previous = $user->last_active_at;

            // Esta línea sirve para calcular si pasaron más de 5 minutos desde la última actividad.
            $staleEnoughToTouch = ! $previous || $previous->lt($now->clone()->subMinutes(5));
            // Esta línea sirve para calcular si cambió la hora desde la última actividad.
            $hourChanged = ! $previous || $previous->format('Y-m-d H') !== $now->format('Y-m-d H');

            // Esta línea sirve para revisar si hay que actualizar la última actividad.
            if ($staleEnoughToTouch || $hourChanged) {
                // Esta línea sirve para guardar la nueva última actividad sin pasar por $fillable.
                $user->forceFill(['last_active_at' => $now])->save();
            }

            // Esta línea sirve para revisar si cambió la hora.
            if ($hourChanged) {
                // Esta línea sirve para registrar un evento de actividad.
                UserActivityEvent::query()->create([
                    // Esta línea sirve para guardar el id del usuario.
                    'user_id' => $user->id,
                    // Esta línea sirve para guardar el tipo de evento "heartbeat".
                    'event_type' => UserActivityEvent::TYPE_HEARTBEAT,
                    // Esta línea sirve para guardar la plataforma: web si la petición tiene sesión, móvil si no.
                    'platform' => $request->hasSession() ? UserActivityEvent::PLATFORM_WEB : UserActivityEvent::PLATFORM_MOBILE,
                    // Esta línea sirve para guardar el momento del evento.
                    'occurred_at' => $now,
                    // Esta línea sirve para guardar la fecha del evento.
                    'activity_date' => $now->toDateString(),
                ]);
            }
        }

        // Esta línea sirve para dejar pasar la petición.
        return $next($request);
    }
}
