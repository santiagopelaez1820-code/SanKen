<?php

namespace App\Domain\Admin\Services;

use App\Models\Report;
use App\Models\User;
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
class GlobalMetricsCalculator
{
    public function calculate(CarbonImmutable $now): array
    {
        return [
            'total_users' => User::query()->count(),
            'new_users_7d' => User::query()->where('created_at', '>=', $now->subDays(7))->count(),
            'trainers_count' => User::query()->where('role', 'trainer')->count(),
            'banned_users_count' => User::query()->where('is_banned', true)->count(),
            'pending_reports_count' => Report::query()->pending()->count(),
            'dau' => User::query()->where('last_active_at', '>=', $now->startOfDay())->count(),
            'wau' => User::query()->where('last_active_at', '>=', $now->subDays(7))->count(),
            'mau' => User::query()->where('last_active_at', '>=', $now->subDays(30))->count(),
            'retention_pct' => $this->retentionPct($now),
        ];
    }

    private function retentionPct(CarbonImmutable $now): float
    {
        $cohort = User::query()
            ->whereBetween('created_at', [$now->subDays(37), $now->subDays(30)])
            ->get(['id', 'last_active_at']);

        if ($cohort->isEmpty()) {
            return 0.0;
        }

        $retained = $cohort->filter(
            fn (User $user) => $user->last_active_at && $user->last_active_at->gte($now->subDays(7))
        )->count();

        return round(($retained / $cohort->count()) * 100, 1);
    }
}
