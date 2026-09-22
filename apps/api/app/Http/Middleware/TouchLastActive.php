<?php

namespace App\Http\Middleware;

use App\Models\UserActivityEvent;
use Closure;
use Illuminate\Http\Request;
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
class TouchLastActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $now = now();
            $previous = $user->last_active_at;

            $staleEnoughToTouch = ! $previous || $previous->lt($now->clone()->subMinutes(5));
            $hourChanged = ! $previous || $previous->format('Y-m-d H') !== $now->format('Y-m-d H');

            if ($staleEnoughToTouch || $hourChanged) {
                $user->forceFill(['last_active_at' => $now])->save();
            }

            if ($hourChanged) {
                UserActivityEvent::query()->create([
                    'user_id' => $user->id,
                    'event_type' => UserActivityEvent::TYPE_HEARTBEAT,
                    'platform' => $request->hasSession() ? UserActivityEvent::PLATFORM_WEB : UserActivityEvent::PLATFORM_MOBILE,
                    'occurred_at' => $now,
                    'activity_date' => $now->toDateString(),
                ]);
            }
        }

        return $next($request);
    }
}
