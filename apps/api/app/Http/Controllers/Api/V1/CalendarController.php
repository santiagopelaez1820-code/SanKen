<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Routine\Actions\DetermineNextRoutineDayAction;
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Calendar\CalendarMonthRequest;
use App\Http\Requests\Calendar\StoreCalendarReminderRequest;
use App\Http\Resources\CalendarReminderResource;
use App\Models\CalendarReminder;
use App\Models\WorkoutSession;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CalendarController extends Controller
{
    /**
     * Arma el calendario del mes leyendo directo de workout_sessions
     * (completados) + calendar_reminders + el entrenamiento sugerido de HOY
     * (mismo DetermineNextRoutineDayAction que ya usa /routines/active) —
     * a propósito no hay proyección a futuro, ver docs/02 y el plan del
     * Sprint 10: las rutinas no tienen un día de la semana fijo.
     */
    public function index(
        CalendarMonthRequest $request,
        RoutineRepositoryInterface $routines,
        DetermineNextRoutineDayAction $nextDay,
    ): JsonResponse {
        $user = $request->user();
        $monthStart = Carbon::createFromFormat('Y-m', $request->validated('month'))->startOfMonth();
        $monthEnd = $monthStart->clone()->endOfMonth();

        // whereDate() en vez de whereBetween() con strings "Y-m-d": el cast
        // `date` de performed_at/event_date persiste como datetime completo
        // (Y-m-d H:i:s) al guardar, así que un whereBetween ingenuo excluiría
        // en silencio lo que caiga justo el último día del mes (mismo caso
        // ya documentado en ChallengeProgressCalculator/AggregateDailyStatsAction).
        $events = WorkoutSession::query()
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->whereDate('performed_at', '>=', $monthStart->toDateString())
            ->whereDate('performed_at', '<=', $monthEnd->toDateString())
            ->with('routineDay')
            ->get()
            ->map(fn (WorkoutSession $session) => [
                'type' => 'workout_completed',
                'event_date' => $session->performed_at->toDateString(),
                'title' => $session->routineDay?->label ?? 'Entrenamiento',
                'duration_minutes' => $session->duration_minutes,
            ])
            ->values();

        $today = Carbon::today();
        if ($today->between($monthStart, $monthEnd)) {
            $routine = $routines->findActiveForUser($user);
            $day = $routine ? $nextDay->execute($routine->loadMissing('days')) : null;

            if ($day !== null) {
                $events->push([
                    'type' => 'workout_planned',
                    'event_date' => $today->toDateString(),
                    'title' => $day->label,
                    'duration_minutes' => null,
                ]);
            }
        }

        $reminders = CalendarReminder::query()
            ->where('user_id', $user->id)
            ->whereDate('event_date', '>=', $monthStart->toDateString())
            ->whereDate('event_date', '<=', $monthEnd->toDateString())
            ->orderBy('event_date')
            ->get();

        $events = $events
            ->concat(CalendarReminderResource::collection($reminders)->resolve())
            ->sortBy('event_date')
            ->values();

        return response()->json(['data' => [
            'month' => $request->validated('month'),
            'events' => $events,
        ]]);
    }

    public function storeReminder(StoreCalendarReminderRequest $request): JsonResponse
    {
        $reminder = CalendarReminder::query()->create([
            'user_id' => $request->user()->id,
            'event_date' => $request->validated('event_date'),
            'title' => $request->validated('title'),
            'notes' => $request->validated('notes'),
        ]);

        return response()->json(['data' => new CalendarReminderResource($reminder)], 201);
    }

    public function destroyReminder(Request $request, CalendarReminder $reminder): JsonResponse
    {
        Gate::authorize('delete', $reminder);

        $reminder->delete();

        return response()->json(status: 204);
    }
}
