<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Alimenta las métricas globales de actividad (DAU/WAU/MAU, ver
 * AdminStatsController) sin una tabla de eventos dedicada. Throttleado a
 * como mucho 1 escritura cada 5 minutos por usuario para no pegarle a la
 * DB en cada request autenticada.
 */
class TouchLastActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && (! $user->last_active_at || $user->last_active_at->lt(now()->subMinutes(5)))) {
            $user->forceFill(['last_active_at' => now()])->save();
        }

        return $next($request);
    }
}
