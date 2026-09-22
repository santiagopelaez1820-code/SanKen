<?php

namespace App\Domain\Admin\Services;

use App\Models\User;
use App\Models\UserActivityEvent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * Métricas del panel "Analítica de uso" (Super Admin) — a diferencia de
 * GlobalMetricsCalculator (DAU/WAU/MAU "rolling", sin historial), acá se
 * lee user_activity_events para poder respetar día/semana/mes CALENDARIO,
 * comparar contra el período anterior y armar la gráfica por hora/día.
 *
 * "Usuario activo" = usuario único (COUNT DISTINCT user_id) con al menos un
 * evento (heartbeat o login) en el rango — nunca se cuenta más de una vez
 * aunque haya entrado varias veces. "Sesiones" SÍ cuenta cada login, a
 * propósito (ver RecordUserSessionAction).
 *
 * Todos los rangos usan CarbonImmutable::now(), igual que
 * GlobalMetricsCalculator — respeta config('app.timezone') sin introducir un
 * segundo sistema de zona horaria.
 */
class UsageAnalyticsCalculator
{
    private const VALID_PERIODS = ['today', 'week', 'month'];

    public function normalizePeriod(?string $period): string
    {
        return in_array($period, self::VALID_PERIODS, true) ? $period : 'today';
    }

    public function overview(CarbonImmutable $now, string $period): array
    {
        $period = $this->normalizePeriod($period);

        [$currentStart, $currentEnd] = $this->rangeFor($period, $now);
        [$previousStart, $previousEnd] = $this->previousRangeFor($period, $now);

        [$todayStart, $todayEnd] = $this->rangeFor('today', $now);
        [$weekStart, $weekEnd] = $this->rangeFor('week', $now);
        [$monthStart, $monthEnd] = $this->rangeFor('month', $now);
        [$yesterdayStart, $yesterdayEnd] = $this->previousRangeFor('today', $now);
        [$prevWeekStart, $prevWeekEnd] = $this->previousRangeFor('week', $now);
        [$prevMonthStart, $prevMonthEnd] = $this->previousRangeFor('month', $now);

        $activeToday = $this->activeUsersCount($todayStart, $todayEnd);
        $activeWeek = $this->activeUsersCount($weekStart, $weekEnd);
        $activeMonth = $this->activeUsersCount($monthStart, $monthEnd);

        $newUsers = $this->newUsersCount($currentStart, $currentEnd);
        $newUsersPrevious = $this->newUsersCount($previousStart, $previousEnd);

        $sessions = $this->sessionsCount($currentStart, $currentEnd);
        $sessionsPrevious = $this->sessionsCount($previousStart, $previousEnd);

        return [
            'period' => $period,
            'active_today' => $activeToday,
            'active_today_change_pct' => $this->changePct($activeToday, $this->activeUsersCount($yesterdayStart, $yesterdayEnd)),
            'active_week' => $activeWeek,
            'active_week_change_pct' => $this->changePct($activeWeek, $this->activeUsersCount($prevWeekStart, $prevWeekEnd)),
            'active_month' => $activeMonth,
            'active_month_change_pct' => $this->changePct($activeMonth, $this->activeUsersCount($prevMonthStart, $prevMonthEnd)),
            'registered_users_total' => User::query()->count(),
            'new_users' => $newUsers,
            'new_users_change_pct' => $this->changePct($newUsers, $newUsersPrevious),
            'sessions' => $sessions,
            'sessions_change_pct' => $this->changePct($sessions, $sessionsPrevious),
        ];
    }

    public function activitySeries(CarbonImmutable $now, string $period): array
    {
        $period = $this->normalizePeriod($period);

        if ($period === 'today') {
            return [
                'period' => $period,
                'granularity' => 'hour',
                'points' => $this->hourlySeries($now),
            ];
        }

        [$start, $end] = $this->rangeFor($period, $now);

        return [
            'period' => $period,
            'granularity' => 'day',
            'points' => $this->dailySeries($start, $end),
        ];
    }

    private function hourlySeries(CarbonImmutable $now): array
    {
        $hourExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "CAST(strftime('%H', occurred_at) AS INTEGER)"
            : 'HOUR(occurred_at)';

        // toBase(): esto es un agregado puro (COUNT/GROUP BY), no hace falta
        // hidratar modelos Eloquent por fila -- el builder base evita ese
        // costo y, más importante, evita que un cast futuro en el modelo
        // convierta la clave del array plucked en algo no usable como key.
        $counts = UserActivityEvent::query()
            ->selectRaw("{$hourExpr} as hour_bucket, COUNT(DISTINCT user_id) as active_users")
            ->where('activity_date', $now->toDateString())
            ->groupBy('hour_bucket')
            ->toBase()
            ->pluck('active_users', 'hour_bucket');

        $points = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $points[] = [
                'label' => sprintf('%02d:00', $hour),
                'value' => (int) ($counts[$hour] ?? 0),
            ];
        }

        return $points;
    }

    private function dailySeries(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $counts = UserActivityEvent::query()
            ->selectRaw('activity_date, COUNT(DISTINCT user_id) as active_users')
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('activity_date')
            ->toBase()
            ->pluck('active_users', 'activity_date');

        $points = [];
        $cursor = $start;
        while ($cursor->lte($end)) {
            $dateKey = $cursor->toDateString();
            $points[] = [
                'label' => $cursor->isoFormat('ddd D'),
                'date' => $dateKey,
                'value' => (int) ($counts[$dateKey] ?? 0),
            ];
            $cursor = $cursor->addDay();
        }

        return $points;
    }

    private function activeUsersCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        return UserActivityEvent::query()
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            ->distinct()
            ->count('user_id');
    }

    private function newUsersCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        return User::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();
    }

    private function sessionsCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        return UserActivityEvent::query()
            ->where('event_type', UserActivityEvent::TYPE_LOGIN)
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            ->count();
    }

    /** Null (no un 0% o un +100% inventado) si el período anterior no tiene base para comparar. */
    private function changePct(int $current, int $previous): ?float
    {
        if ($previous === 0) {
            return null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /** @return array{0: CarbonImmutable, 1: CarbonImmutable} */
    private function rangeFor(string $period, CarbonImmutable $now): array
    {
        return match ($period) {
            'week' => [$now->startOfWeek(), $now->endOfWeek()],
            'month' => [$now->startOfMonth(), $now->endOfMonth()],
            default => [$now->startOfDay(), $now->endOfDay()],
        };
    }

    /** @return array{0: CarbonImmutable, 1: CarbonImmutable} */
    private function previousRangeFor(string $period, CarbonImmutable $now): array
    {
        return match ($period) {
            'week' => $this->rangeFor('week', $now->subWeek()),
            'month' => $this->rangeFor('month', $now->subMonthNoOverflow()),
            default => $this->rangeFor('today', $now->subDay()),
        };
    }
}
