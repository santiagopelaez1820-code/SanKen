<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Application\Support\Actions\AddSupportMessageAction;
use App\Application\Support\Actions\UpdateSupportTicketAction;
use App\Domain\Support\Services\SupportStatsCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Support\SupportMessageRequest;
use App\Http\Requests\Support\UpdateSupportTicketRequest;
use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

/**
 * Panel de soporte del equipo (grupo de rutas role:super_admin, y además
 * SupportTicketPolicy::manage en cada acción sobre una solicitud).
 */
class AdminSupportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', 'string', Rule::in([...config('support.ticket_statuses'), 'awaiting', 'all'])],
            'type' => ['nullable', 'string', Rule::in(config('support.ticket_types'))],
            'priority' => ['nullable', 'string', Rule::in(config('support.ticket_priorities'))],
            'q' => ['nullable', 'string', 'max:100'],
            'user' => ['nullable', 'string', 'max:100'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'assigned_to_me' => ['nullable', 'boolean'],
        ]);

        $status = $filters['status'] ?? 'all';

        $tickets = SupportTicket::query()
            ->with(['user', 'assignee'])
            ->when($status === 'awaiting', fn ($q) => $q->awaitingStaff())
            ->when(! in_array($status, ['all', 'awaiting'], true), fn ($q) => $q->where('status', $status))
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when($filters['priority'] ?? null, fn ($q, $priority) => $q->where('priority', $priority))
            ->when($filters['q'] ?? null, fn ($q, $text) => $q->where(fn ($sub) => $sub
                ->where('subject', 'like', "%{$text}%")
                ->orWhereHas('messages', fn ($m) => $m->where('body', 'like', "%{$text}%"))
                ->when(ctype_digit($text), fn ($s) => $s->orWhere('id', (int) $text))))
            ->when($filters['user'] ?? null, fn ($q, $user) => $q->whereHas('user', fn ($u) => $u
                ->where('name', 'like', "%{$user}%")
                ->orWhere('email', 'like', "%{$user}%")))
            ->when($filters['from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($q, $to) => $q->whereDate('created_at', '<=', $to))
            ->when($request->boolean('assigned_to_me'), fn ($q) => $q->where('assigned_to', $request->user()->id))
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END")
            ->orderByDesc('last_message_at')
            ->paginate(20);

        return response()->json([
            'data' => $tickets->getCollection()->map(fn (SupportTicket $t) => SupportTicketResource::forStaff($t))->values(),
            'meta' => $this->paginationMeta($tickets),
        ]);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        Gate::authorize('manage', $ticket);

        return response()->json(['data' => SupportTicketResource::forStaff($ticket->load(['messages.author', 'user', 'assignee']))]);
    }

    public function reply(SupportMessageRequest $request, SupportTicket $ticket, AddSupportMessageAction $action): JsonResponse
    {
        Gate::authorize('manage', $ticket);

        $action->execute($ticket, $request->user(), $request->validated('body'), asStaff: true);

        return response()->json(['data' => SupportTicketResource::forStaff($ticket->fresh()->load(['messages.author', 'user', 'assignee']))], 201);
    }

    public function update(UpdateSupportTicketRequest $request, SupportTicket $ticket, UpdateSupportTicketAction $action): JsonResponse
    {
        Gate::authorize('manage', $ticket);

        $ticket = $action->execute($ticket, $request->validated());

        return response()->json(['data' => SupportTicketResource::forStaff($ticket->load(['messages.author', 'user', 'assignee']))]);
    }

    /** Miembros del equipo a los que se puede asignar una solicitud. */
    public function staff(): JsonResponse
    {
        return response()->json([
            'data' => User::query()->where('role', 'super_admin')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function stats(SupportStatsCalculator $calculator): JsonResponse
    {
        return response()->json(['data' => $calculator->calculate()]);
    }
}
