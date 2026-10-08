<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de administración.

namespace App\Domain\Admin\Services;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo que guarda eventos de actividad del usuario.
use App\Models\UserActivityEvent;
// Esta línea sirve para importar CarbonImmutable para manejar fechas.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar la fachada DB para saber qué motor de base de datos se usa.
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
// Esta línea sirve para declarar el servicio que calcula la analítica de uso del panel admin.
class UsageAnalyticsCalculator
{
    // Esta línea sirve para definir los períodos válidos: hoy, semana y mes.
    private const VALID_PERIODS = ['today', 'week', 'month'];

    // Esta línea sirve para declarar el método que valida el período pedido.
    public function normalizePeriod(?string $period): string
    {
        // Esta línea sirve para devolver el período si es válido, o "today" si no.
        return in_array($period, self::VALID_PERIODS, true) ? $period : 'today';
    }

    // Esta línea sirve para declarar el método que arma el resumen de uso de un período.
    public function overview(CarbonImmutable $now, string $period): array
    {
        // Esta línea sirve para asegurar que el período sea válido.
        $period = $this->normalizePeriod($period);

        // Esta línea sirve para calcular el inicio y fin del período actual.
        [$currentStart, $currentEnd] = $this->rangeFor($period, $now);
        // Esta línea sirve para calcular el inicio y fin del período anterior.
        [$previousStart, $previousEnd] = $this->previousRangeFor($period, $now);

        // Esta línea sirve para calcular el rango de hoy.
        [$todayStart, $todayEnd] = $this->rangeFor('today', $now);
        // Esta línea sirve para calcular el rango de esta semana.
        [$weekStart, $weekEnd] = $this->rangeFor('week', $now);
        // Esta línea sirve para calcular el rango de este mes.
        [$monthStart, $monthEnd] = $this->rangeFor('month', $now);
        // Esta línea sirve para calcular el rango de ayer.
        [$yesterdayStart, $yesterdayEnd] = $this->previousRangeFor('today', $now);
        // Esta línea sirve para calcular el rango de la semana anterior.
        [$prevWeekStart, $prevWeekEnd] = $this->previousRangeFor('week', $now);
        // Esta línea sirve para calcular el rango del mes anterior.
        [$prevMonthStart, $prevMonthEnd] = $this->previousRangeFor('month', $now);

        // Esta línea sirve para contar los usuarios activos hoy.
        $activeToday = $this->activeUsersCount($todayStart, $todayEnd);
        // Esta línea sirve para contar los usuarios activos esta semana.
        $activeWeek = $this->activeUsersCount($weekStart, $weekEnd);
        // Esta línea sirve para contar los usuarios activos este mes.
        $activeMonth = $this->activeUsersCount($monthStart, $monthEnd);

        // Esta línea sirve para contar los usuarios nuevos del período actual.
        $newUsers = $this->newUsersCount($currentStart, $currentEnd);
        // Esta línea sirve para contar los usuarios nuevos del período anterior.
        $newUsersPrevious = $this->newUsersCount($previousStart, $previousEnd);

        // Esta línea sirve para contar los inicios de sesión del período actual.
        $sessions = $this->sessionsCount($currentStart, $currentEnd);
        // Esta línea sirve para contar los inicios de sesión del período anterior.
        $sessionsPrevious = $this->sessionsCount($previousStart, $previousEnd);

        // Esta línea sirve para devolver el resumen.
        return [
            // Esta línea sirve para incluir el período usado.
            'period' => $period,
            // Esta línea sirve para incluir los activos de hoy.
            'active_today' => $activeToday,
            // Esta línea sirve para incluir la variación porcentual contra ayer.
            'active_today_change_pct' => $this->changePct($activeToday, $this->activeUsersCount($yesterdayStart, $yesterdayEnd)),
            // Esta línea sirve para incluir los activos de la semana.
            'active_week' => $activeWeek,
            // Esta línea sirve para incluir la variación contra la semana anterior.
            'active_week_change_pct' => $this->changePct($activeWeek, $this->activeUsersCount($prevWeekStart, $prevWeekEnd)),
            // Esta línea sirve para incluir los activos del mes.
            'active_month' => $activeMonth,
            // Esta línea sirve para incluir la variación contra el mes anterior.
            'active_month_change_pct' => $this->changePct($activeMonth, $this->activeUsersCount($prevMonthStart, $prevMonthEnd)),
            // Esta línea sirve para incluir el total de usuarios registrados.
            'registered_users_total' => User::query()->count(),
            // Esta línea sirve para incluir los usuarios nuevos del período.
            'new_users' => $newUsers,
            // Esta línea sirve para incluir la variación de usuarios nuevos.
            'new_users_change_pct' => $this->changePct($newUsers, $newUsersPrevious),
            // Esta línea sirve para incluir las sesiones del período.
            'sessions' => $sessions,
            // Esta línea sirve para incluir la variación de sesiones.
            'sessions_change_pct' => $this->changePct($sessions, $sessionsPrevious),
        ];
    }

    // Esta línea sirve para declarar el método que arma la serie de actividad para la gráfica.
    public function activitySeries(CarbonImmutable $now, string $period): array
    {
        // Esta línea sirve para asegurar que el período sea válido.
        $period = $this->normalizePeriod($period);

        // Esta línea sirve para revisar si el período es hoy.
        if ($period === 'today') {
            // Esta línea sirve para devolver la serie por hora.
            return [
                // Esta línea sirve para incluir el período.
                'period' => $period,
                // Esta línea sirve para indicar que los puntos son por hora.
                'granularity' => 'hour',
                // Esta línea sirve para incluir los puntos de cada hora.
                'points' => $this->hourlySeries($now),
            ];
        }

        // Esta línea sirve para calcular el inicio y fin del período.
        [$start, $end] = $this->rangeFor($period, $now);

        // Esta línea sirve para devolver la serie por día.
        return [
            // Esta línea sirve para incluir el período.
            'period' => $period,
            // Esta línea sirve para indicar que los puntos son por día.
            'granularity' => 'day',
            // Esta línea sirve para incluir los puntos de cada día.
            'points' => $this->dailySeries($start, $end),
        ];
    }

    // Esta línea sirve para declarar el método privado que arma la serie por hora de hoy.
    private function hourlySeries(CarbonImmutable $now): array
    {
        // Esta línea sirve para elegir cómo extraer la hora según el motor de base de datos.
        $hourExpr = DB::connection()->getDriverName() === 'sqlite'
            // Esta línea sirve para usar strftime si la base es SQLite.
            ? "CAST(strftime('%H', occurred_at) AS INTEGER)"
            // Esta línea sirve para usar HOUR() si la base es MySQL.
            : 'HOUR(occurred_at)';

        // toBase(): esto es un agregado puro (COUNT/GROUP BY), no hace falta
        // hidratar modelos Eloquent por fila -- el builder base evita ese
        // costo y, más importante, evita que un cast futuro en el modelo
        // convierta la clave del array plucked en algo no usable como key.
        // Esta línea sirve para consultar los eventos de actividad.
        $counts = UserActivityEvent::query()
            // Esta línea sirve para seleccionar la hora y los usuarios únicos activos.
            ->selectRaw("{$hourExpr} as hour_bucket, COUNT(DISTINCT user_id) as active_users")
            // Esta línea sirve para filtrar solo los eventos de hoy.
            ->where('activity_date', $now->toDateString())
            // Esta línea sirve para agrupar por hora.
            ->groupBy('hour_bucket')
            // Esta línea sirve para usar la consulta base sin crear modelos.
            ->toBase()
            // Esta línea sirve para obtener los usuarios activos indexados por hora.
            ->pluck('active_users', 'hour_bucket');

        // Esta línea sirve para iniciar la lista de puntos.
        $points = [];
        // Esta línea sirve para recorrer las 24 horas del día.
        for ($hour = 0; $hour < 24; $hour++) {
            // Esta línea sirve para agregar el punto de esa hora.
            $points[] = [
                // Esta línea sirve para poner la etiqueta HH:00.
                'label' => sprintf('%02d:00', $hour),
                // Esta línea sirve para poner la cantidad de usuarios activos (0 si no hubo).
                'value' => (int) ($counts[$hour] ?? 0),
            ];
        }

        // Esta línea sirve para devolver los puntos.
        return $points;
    }

    // Esta línea sirve para declarar el método privado que arma la serie por día de un rango.
    private function dailySeries(CarbonImmutable $start, CarbonImmutable $end): array
    {
        // Esta línea sirve para consultar los eventos de actividad.
        $counts = UserActivityEvent::query()
            // Esta línea sirve para seleccionar la fecha y los usuarios únicos activos.
            ->selectRaw('activity_date, COUNT(DISTINCT user_id) as active_users')
            // Esta línea sirve para filtrar solo dentro del rango de fechas.
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            // Esta línea sirve para agrupar por fecha.
            ->groupBy('activity_date')
            // Esta línea sirve para usar la consulta base sin crear modelos.
            ->toBase()
            // Esta línea sirve para obtener los usuarios activos indexados por fecha.
            ->pluck('active_users', 'activity_date');

        // Esta línea sirve para iniciar la lista de puntos.
        $points = [];
        // Esta línea sirve para empezar en la fecha de inicio.
        $cursor = $start;
        // Esta línea sirve para recorrer día por día hasta la fecha de fin.
        while ($cursor->lte($end)) {
            // Esta línea sirve para obtener la fecha como texto.
            $dateKey = $cursor->toDateString();
            // Esta línea sirve para agregar el punto de ese día.
            $points[] = [
                // Esta línea sirve para poner la etiqueta del día (ej. "lun 6").
                'label' => $cursor->isoFormat('ddd D'),
                // Esta línea sirve para poner la fecha.
                'date' => $dateKey,
                // Esta línea sirve para poner la cantidad de usuarios activos (0 si no hubo).
                'value' => (int) ($counts[$dateKey] ?? 0),
            ];
            // Esta línea sirve para avanzar al día siguiente.
            $cursor = $cursor->addDay();
        }

        // Esta línea sirve para devolver los puntos.
        return $points;
    }

    // Esta línea sirve para declarar el método privado que cuenta usuarios activos en un rango.
    private function activeUsersCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        // Esta línea sirve para consultar los eventos de actividad y devolver el conteo.
        return UserActivityEvent::query()
            // Esta línea sirve para filtrar dentro del rango de fechas.
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            // Esta línea sirve para contar cada usuario una sola vez.
            ->distinct()
            // Esta línea sirve para contar los usuarios únicos.
            ->count('user_id');
    }

    // Esta línea sirve para declarar el método privado que cuenta usuarios nuevos en un rango.
    private function newUsersCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        // Esta línea sirve para consultar los usuarios y devolver el conteo.
        return User::query()
            // Esta línea sirve para filtrar los registrados dentro del rango.
            ->whereBetween('created_at', [$start, $end])
            // Esta línea sirve para contarlos.
            ->count();
    }

    // Esta línea sirve para declarar el método privado que cuenta inicios de sesión en un rango.
    private function sessionsCount(CarbonImmutable $start, CarbonImmutable $end): int
    {
        // Esta línea sirve para consultar los eventos de actividad y devolver el conteo.
        return UserActivityEvent::query()
            // Esta línea sirve para filtrar solo los eventos de inicio de sesión.
            ->where('event_type', UserActivityEvent::TYPE_LOGIN)
            // Esta línea sirve para filtrar dentro del rango de fechas.
            ->whereBetween('activity_date', [$start->toDateString(), $end->toDateString()])
            // Esta línea sirve para contarlos.
            ->count();
    }

    /** Null (no un 0% o un +100% inventado) si el período anterior no tiene base para comparar. */
    // Esta línea sirve para declarar el método privado que calcula la variación porcentual.
    private function changePct(int $current, int $previous): ?float
    {
        // Esta línea sirve para revisar si el período anterior es cero.
        if ($previous === 0) {
            // Esta línea sirve para devolver null porque no hay base para comparar.
            return null;
        }

        // Esta línea sirve para devolver la variación porcentual redondeada a un decimal.
        return round((($current - $previous) / $previous) * 100, 1);
    }

    /** @return array{0: CarbonImmutable, 1: CarbonImmutable} */
    // Esta línea sirve para declarar el método privado que calcula el inicio y fin de un período.
    private function rangeFor(string $period, CarbonImmutable $now): array
    {
        // Esta línea sirve para elegir el rango según el período.
        return match ($period) {
            // Esta línea sirve para usar, para la semana, del inicio al fin de la semana.
            'week' => [$now->startOfWeek(), $now->endOfWeek()],
            // Esta línea sirve para usar, para el mes, del inicio al fin del mes.
            'month' => [$now->startOfMonth(), $now->endOfMonth()],
            // Esta línea sirve para usar, para hoy, del inicio al fin del día.
            default => [$now->startOfDay(), $now->endOfDay()],
        };
    }

    /** @return array{0: CarbonImmutable, 1: CarbonImmutable} */
    // Esta línea sirve para declarar el método privado que calcula el rango del período anterior.
    private function previousRangeFor(string $period, CarbonImmutable $now): array
    {
        // Esta línea sirve para elegir el rango anterior según el período.
        return match ($period) {
            // Esta línea sirve para calcular el rango de la semana anterior.
            'week' => $this->rangeFor('week', $now->subWeek()),
            // Esta línea sirve para calcular el rango del mes anterior (sin desbordar días).
            'month' => $this->rangeFor('month', $now->subMonthNoOverflow()),
            // Esta línea sirve para ayer.
            default => $this->rangeFor('today', $now->subDay()),
        };
    }
}
