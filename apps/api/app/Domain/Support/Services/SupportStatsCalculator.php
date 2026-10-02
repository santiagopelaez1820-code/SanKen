<?php

namespace App\Domain\Support\Services;

use App\Models\SupportTicket;
use App\Models\WeeklyCheckin;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * Indicadores del panel de soporte, siempre calculados sobre las tablas
 * reales (nada estimado). Los promedios de tiempo se calculan en PHP sobre
 * los últimos 90 días (volumen bajo; así es igual en MySQL y en el SQLite
 * de los tests).
 */
class SupportStatsCalculator
{
    private const RECENT_WEEKS = 4;

    public function __construct(
        private readonly WeeklyCheckinService $checkins,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function calculate(): array
    {
        $now = $this->checkins->now();
        $weekStart = $now->startOfWeek(CarbonInterface::MONDAY)->utc();
        $since90 = now()->subDays(90);

        $byStatus = SupportTicket::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        $responded = SupportTicket::query()->whereNotNull('first_response_at')->where('created_at', '>=', $since90)->get(['created_at', 'first_response_at']);
        $resolved = SupportTicket::query()->whereNotNull('resolved_at')->where('created_at', '>=', $since90)->get(['created_at', 'resolved_at']);

        $currentWeek = $this->checkins->weekKey();
        $recentWeeks = collect(range(0, self::RECENT_WEEKS - 1))
            ->map(fn (int $i) => $this->checkins->weekKey($now->subWeeks($i)))
            ->all();

        $weekRows = WeeklyCheckin::query()->whereIn('week', $recentWeeks)->get(['week', 'status', 'mood', 'topic', 'notified_at', 'shown_at']);

        return [
            'tickets' => [
                'open' => (int) ($byStatus['open'] ?? 0),
                'in_review' => (int) ($byStatus['in_review'] ?? 0),
                'answered' => (int) ($byStatus['answered'] ?? 0),
                'resolved' => (int) ($byStatus['resolved'] ?? 0),
                'closed' => (int) ($byStatus['closed'] ?? 0),
                'awaiting_staff' => SupportTicket::query()->awaitingStaff()->count(),
                'this_week' => SupportTicket::query()->where('created_at', '>=', $weekStart)->count(),
                'total' => (int) $byStatus->sum(),
                'by_type' => SupportTicket::query()->selectRaw('type, count(*) as total')->groupBy('type')->pluck('total', 'type'),
                'avg_first_response_hours' => $this->averageHours($responded, 'first_response_at'),
                'avg_resolution_hours' => $this->averageHours($resolved, 'resolved_at'),
            ],
            'checkins' => [
                'current_week' => $currentWeek,
                'weeks' => collect($recentWeeks)->map(function (string $week) use ($weekRows, $currentWeek) {
                    $rows = $weekRows->where('week', $week);
                    $answered = $rows->where('status', WeeklyCheckin::STATUS_ANSWERED)->count();
                    // Ofrecidos = se le mostraron o se le avisaron al usuario.
                    $offered = $rows->filter(fn ($r) => $r->shown_at || $r->notified_at)->count();

                    return [
                        'week' => $week,
                        'offered' => $offered,
                        'answered' => $answered,
                        'postponed' => $rows->whereIn('status', [WeeklyCheckin::STATUS_POSTPONED, WeeklyCheckin::STATUS_DISMISSED])->count(),
                        // Semana ya terminada: lo ofrecido y no respondido quedó ignorado.
                        'ignored' => $week === $currentWeek ? null : max(0, $offered - $answered),
                        'response_rate' => $offered > 0 ? round($answered / $offered * 100, 1) : null,
                    ];
                })->values(),
                'moods' => $weekRows->where('status', WeeklyCheckin::STATUS_ANSWERED)->countBy('mood'),
                'topics' => $weekRows->where('status', WeeklyCheckin::STATUS_ANSWERED)->countBy('topic'),
            ],
        ];
    }

    /**
     * @param  Collection<int, SupportTicket>  $tickets
     */
    private function averageHours(Collection $tickets, string $until): ?float
    {
        if ($tickets->isEmpty()) {
            return null;
        }

        $avgSeconds = $tickets->avg(fn (SupportTicket $t) => $t->created_at->diffInSeconds($t->{$until}));

        return round($avgSeconds / 3600, 1);
    }
}
