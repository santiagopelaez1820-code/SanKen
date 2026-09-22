<?php

namespace App\Application\Auth\Actions;

use App\Models\User;
use App\Models\UserActivityEvent;
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
class RecordUserSessionAction
{
    public function execute(User $user, Request $request): void
    {
        $now = now();

        UserActivityEvent::query()->create([
            'user_id' => $user->id,
            'event_type' => UserActivityEvent::TYPE_LOGIN,
            'platform' => $request->hasSession() ? UserActivityEvent::PLATFORM_WEB : UserActivityEvent::PLATFORM_MOBILE,
            'occurred_at' => $now,
            'activity_date' => $now->toDateString(),
        ]);
    }
}
