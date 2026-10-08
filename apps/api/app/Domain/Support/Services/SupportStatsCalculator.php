<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de soporte.

namespace App\Domain\Support\Services;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar la interfaz de fechas de Carbon.
use Carbon\CarbonInterface;
// Esta línea sirve para importar la clase Collection para trabajar con listas.
use Illuminate\Support\Collection;

/**
 * Indicadores del panel de soporte, siempre calculados sobre las tablas
 * reales (nada estimado). Los promedios de tiempo se calculan en PHP sobre
 * los últimos 90 días (volumen bajo; así es igual en MySQL y en el SQLite
 * de los tests).
 */
// Esta línea sirve para declarar el servicio que calcula los indicadores del panel de soporte.
class SupportStatsCalculator
{
    // Esta línea sirve para definir cuántas semanas recientes se analizan (4).
    private const RECENT_WEEKS = 4;

    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir el servicio del check-in semanal.
        private readonly WeeklyCheckinService $checkins,
    ) {}

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que calcula todos los indicadores.
    public function calculate(): array
    {
        // Esta línea sirve para obtener la fecha actual en la zona del check-in.
        $now = $this->checkins->now();
        // Esta línea sirve para calcular el lunes de esta semana en UTC.
        $weekStart = $now->startOfWeek(CarbonInterface::MONDAY)->utc();
        // Esta línea sirve para calcular la fecha de hace 90 días.
        $since90 = now()->subDays(90);

        // Esta línea sirve para contar las solicitudes por estado.
        $byStatus = SupportTicket::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        // Esta línea sirve para obtener las solicitudes respondidas de los últimos 90 días.
        $responded = SupportTicket::query()->whereNotNull('first_response_at')->where('created_at', '>=', $since90)->get(['created_at', 'first_response_at']);
        // Esta línea sirve para obtener las solicitudes resueltas de los últimos 90 días.
        $resolved = SupportTicket::query()->whereNotNull('resolved_at')->where('created_at', '>=', $since90)->get(['created_at', 'resolved_at']);

        // Esta línea sirve para obtener la clave de la semana actual.
        $currentWeek = $this->checkins->weekKey();
        // Esta línea sirve para armar la lista de las últimas 4 semanas.
        $recentWeeks = collect(range(0, self::RECENT_WEEKS - 1))
            // Esta línea sirve para calcular la clave de cada semana.
            ->map(fn (int $i) => $this->checkins->weekKey($now->subWeeks($i)))
            // Esta línea sirve para convertir en arreglo.
            ->all();

        // Esta línea sirve para obtener los check-ins de esas semanas.
        $weekRows = WeeklyCheckin::query()->whereIn('week', $recentWeeks)->get(['week', 'status', 'mood', 'topic', 'notified_at', 'shown_at']);

        // Esta línea sirve para devolver los indicadores.
        return [
            // Esta línea sirve para agrupar los indicadores de solicitudes.
            'tickets' => [
                // Esta línea sirve para contar las solicitudes abiertas.
                'open' => (int) ($byStatus['open'] ?? 0),
                // Esta línea sirve para contar las solicitudes en revisión.
                'in_review' => (int) ($byStatus['in_review'] ?? 0),
                // Esta línea sirve para contar las solicitudes respondidas.
                'answered' => (int) ($byStatus['answered'] ?? 0),
                // Esta línea sirve para contar las solicitudes resueltas.
                'resolved' => (int) ($byStatus['resolved'] ?? 0),
                // Esta línea sirve para contar las solicitudes cerradas.
                'closed' => (int) ($byStatus['closed'] ?? 0),
                // Esta línea sirve para contar las que esperan respuesta del equipo.
                'awaiting_staff' => SupportTicket::query()->awaitingStaff()->count(),
                // Esta línea sirve para contar las creadas esta semana.
                'this_week' => SupportTicket::query()->where('created_at', '>=', $weekStart)->count(),
                // Esta línea sirve para contar el total de solicitudes.
                'total' => (int) $byStatus->sum(),
                // Esta línea sirve para contar las solicitudes por tipo.
                'by_type' => SupportTicket::query()->selectRaw('type, count(*) as total')->groupBy('type')->pluck('total', 'type'),
                // Esta línea sirve para calcular el promedio de horas hasta la primera respuesta.
                'avg_first_response_hours' => $this->averageHours($responded, 'first_response_at'),
                // Esta línea sirve para calcular el promedio de horas hasta la resolución.
                'avg_resolution_hours' => $this->averageHours($resolved, 'resolved_at'),
            ],
            // Esta línea sirve para agrupar los indicadores de check-ins.
            'checkins' => [
                // Esta línea sirve para incluir la clave de la semana actual.
                'current_week' => $currentWeek,
                // Esta línea sirve para armar los datos de cada semana.
                'weeks' => collect($recentWeeks)->map(function (string $week) use ($weekRows, $currentWeek) {
                    // Esta línea sirve para obtener los check-ins de esa semana.
                    $rows = $weekRows->where('week', $week);
                    // Esta línea sirve para contar los respondidos.
                    $answered = $rows->where('status', WeeklyCheckin::STATUS_ANSWERED)->count();
                    // Ofrecidos = se le mostraron o se le avisaron al usuario.
                    // Esta línea sirve para contar los ofrecidos (mostrados o avisados).
                    $offered = $rows->filter(fn ($r) => $r->shown_at || $r->notified_at)->count();

                    // Esta línea sirve para devolver los datos de la semana.
                    return [
                        // Esta línea sirve para incluir la semana.
                        'week' => $week,
                        // Esta línea sirve para incluir los ofrecidos.
                        'offered' => $offered,
                        // Esta línea sirve para incluir los respondidos.
                        'answered' => $answered,
                        // Esta línea sirve para incluir los pospuestos o descartados.
                        'postponed' => $rows->whereIn('status', [WeeklyCheckin::STATUS_POSTPONED, WeeklyCheckin::STATUS_DISMISSED])->count(),
                        // Semana ya terminada: lo ofrecido y no respondido quedó ignorado.
                        // Esta línea sirve para incluir los ignorados (null si la semana sigue en curso).
                        'ignored' => $week === $currentWeek ? null : max(0, $offered - $answered),
                        // Esta línea sirve para incluir el porcentaje de respuesta (null si no se ofreció ninguno).
                        'response_rate' => $offered > 0 ? round($answered / $offered * 100, 1) : null,
                    ];
                    // Esta línea sirve para reindexar la lista de semanas.
                })->values(),
                // Esta línea sirve para contar los estados de ánimo de las respuestas.
                'moods' => $weekRows->where('status', WeeklyCheckin::STATUS_ANSWERED)->countBy('mood'),
                // Esta línea sirve para contar los temas de las respuestas.
                'topics' => $weekRows->where('status', WeeklyCheckin::STATUS_ANSWERED)->countBy('topic'),
            ],
        ];
    }

    /**
     * @param  Collection<int, SupportTicket>  $tickets
     */
    // Esta línea sirve para declarar el método privado que calcula el promedio de horas.
    private function averageHours(Collection $tickets, string $until): ?float
    {
        // Esta línea sirve para revisar si no hay solicitudes.
        if ($tickets->isEmpty()) {
            // Esta línea sirve para devolver null porque no hay con qué calcular.
            return null;
        }

        // Esta línea sirve para calcular el promedio de segundos entre la creación y la fecha indicada.
        $avgSeconds = $tickets->avg(fn (SupportTicket $t) => $t->created_at->diffInSeconds($t->{$until}));

        // Esta línea sirve para convertir el promedio a horas con un decimal.
        return round($avgSeconds / 3600, 1);
    }
}
