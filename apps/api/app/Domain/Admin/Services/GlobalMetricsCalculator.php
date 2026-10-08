<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de administración.

namespace App\Domain\Admin\Services;

// Esta línea sirve para importar el modelo Report (reporte de contenido).
use App\Models\Report;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar CarbonImmutable para manejar fechas.
use Carbon\CarbonImmutable;

/**
 * Métricas globales de plataforma para el panel admin. Sin tabla de
 * eventos dedicada: DAU/WAU/MAU se derivan de users.last_active_at
 * (ver TouchLastActive), que solo guarda el último timestamp de actividad
 * por usuario — no un historial completo. La "retención" es una
 * simplificación deliberada acorde a ese límite: % de usuarios creados
 * hace ~30 días que siguen activos en los últimos 7 — no es un cohort
 * analysis completo.
 */
// Esta línea sirve para declarar el servicio que calcula las métricas globales de la plataforma.
class GlobalMetricsCalculator
{
    // Esta línea sirve para declarar el método que calcula las métricas a partir de la fecha actual.
    public function calculate(CarbonImmutable $now): array
    {
        // Esta línea sirve para devolver las métricas.
        return [
            // Esta línea sirve para contar el total de usuarios.
            'total_users' => User::query()->count(),
            // Esta línea sirve para contar los usuarios registrados en los últimos 7 días.
            'new_users_7d' => User::query()->where('created_at', '>=', $now->subDays(7))->count(),
            // Esta línea sirve para contar los entrenadores.
            'trainers_count' => User::query()->where('role', 'trainer')->count(),
            // Esta línea sirve para contar los usuarios baneados.
            'banned_users_count' => User::query()->where('is_banned', true)->count(),
            // Esta línea sirve para contar los reportes pendientes de revisar.
            'pending_reports_count' => Report::query()->pending()->count(),
            // Esta línea sirve para contar los usuarios activos hoy (DAU).
            'dau' => User::query()->where('last_active_at', '>=', $now->startOfDay())->count(),
            // Esta línea sirve para contar los usuarios activos en los últimos 7 días (WAU).
            'wau' => User::query()->where('last_active_at', '>=', $now->subDays(7))->count(),
            // Esta línea sirve para contar los usuarios activos en los últimos 30 días (MAU).
            'mau' => User::query()->where('last_active_at', '>=', $now->subDays(30))->count(),
            // Esta línea sirve para calcular el porcentaje de retención.
            'retention_pct' => $this->retentionPct($now),
        ];
    }

    // Esta línea sirve para declarar el método privado que calcula la retención.
    private function retentionPct(CarbonImmutable $now): float
    {
        // Esta línea sirve para consultar el grupo de usuarios a medir.
        $cohort = User::query()
            // Esta línea sirve para filtrar los registrados hace entre 30 y 37 días.
            ->whereBetween('created_at', [$now->subDays(37), $now->subDays(30)])
            // Esta línea sirve para obtener solo su id y su última actividad.
            ->get(['id', 'last_active_at']);

        // Esta línea sirve para revisar si el grupo está vacío.
        if ($cohort->isEmpty()) {
            // Esta línea sirve para devolver 0 porque no hay a quién medir.
            return 0.0;
        }

        // Esta línea sirve para contar cuántos del grupo siguen activos.
        $retained = $cohort->filter(
            // Esta línea sirve para exigir que hayan tenido actividad en los últimos 7 días.
            fn (User $user) => $user->last_active_at && $user->last_active_at->gte($now->subDays(7))
            // Esta línea sirve para obtener la cantidad de usuarios retenidos.
        )->count();

        // Esta línea sirve para devolver el porcentaje de retenidos redondeado a un decimal.
        return round(($retained / $cohort->count()) * 100, 1);
    }
}
