<?php

namespace App\Http\Controllers\Api\V1\Support;

use App\Application\Support\Actions\AnswerWeeklyCheckinAction;
use App\Domain\Support\Services\WeeklyCheckinService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Support\AnswerWeeklyCheckinRequest;
use App\Http\Resources\SupportTicketResource;
use App\Http\Resources\WeeklyCheckinResource;
use App\Models\WeeklyCheckin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class WeeklyCheckinController extends Controller
{
    /**
     * Check-in de esta semana. La app lo consulta al abrirse: `should_prompt`
     * dice si hay que mostrarlo ahora (pendiente, o pospuesto y ya pasó el
     * plazo). Al mostrarse se registra shown_at. Fuera de la ventana
     * (lunes-jueves) o si el usuario no es elegible, `checkin` es null.
     */
    public function current(Request $request, WeeklyCheckinService $service): JsonResponse
    {
        $checkin = $service->currentFor($request->user());
        $shouldPrompt = $checkin && $service->shouldPrompt($checkin);

        if ($shouldPrompt) {
            $service->markShown($checkin);
        }

        return response()->json(['data' => [
            'checkin' => $checkin ? new WeeklyCheckinResource($checkin) : null,
            'should_prompt' => $shouldPrompt,
        ]]);
    }

    public function answer(AnswerWeeklyCheckinRequest $request, WeeklyCheckin $checkin, WeeklyCheckinService $service, AnswerWeeklyCheckinAction $action): JsonResponse
    {
        $this->ensureAnswerable($request, $checkin, $service);

        $ticket = $action->execute(
            $checkin,
            $request->validated('mood'),
            $request->validated('topic'),
            $request->validated('comment'),
        );

        return response()->json(['data' => [
            'checkin' => new WeeklyCheckinResource($checkin->fresh()),
            'ticket' => $ticket ? new SupportTicketResource($ticket->load('messages.author')) : null,
        ]]);
    }

    public function postpone(Request $request, WeeklyCheckin $checkin, WeeklyCheckinService $service): JsonResponse
    {
        $this->ensureAnswerable($request, $checkin, $service);

        return response()->json(['data' => [
            'checkin' => new WeeklyCheckinResource($service->postpone($checkin)),
        ]]);
    }

    /**
     * Solo el dueño, solo el check-in de la semana en curso y solo si no fue
     * respondido ya: no se puede responder (ni reescribir) un check-in de otra
     * persona, de una semana pasada, ni dos veces el mismo.
     */
    private function ensureAnswerable(Request $request, WeeklyCheckin $checkin, WeeklyCheckinService $service): void
    {
        abort_unless($checkin->user_id === $request->user()->id, 404);

        if ($checkin->status === WeeklyCheckin::STATUS_ANSWERED) {
            throw ValidationException::withMessages(['checkin' => ['Ya respondiste el check-in de esta semana.']]);
        }

        if (! $service->isCurrentWeek($checkin)) {
            throw ValidationException::withMessages(['checkin' => ['Este check-in ya no está disponible.']]);
        }
    }
}
