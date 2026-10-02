<?php

namespace App\Http\Controllers\Api\V1\Support;

use App\Application\Support\Actions\AddSupportMessageAction;
use App\Application\Support\Actions\CreateSupportTicketAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Support\StoreSupportTicketRequest;
use App\Http\Requests\Support\SupportMessageRequest;
use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * Solicitudes del propio usuario. Todo se consulta desde $request->user():
 * un usuario nunca puede listar, abrir ni escribir en solicitudes ajenas
 * (SupportTicketPolicy lo verifica además en cada solicitud concreta).
 */
class SupportTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tickets = $request->user()->supportTickets()
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json([
            'data' => SupportTicketResource::collection($tickets->items()),
            'meta' => $this->paginationMeta($tickets),
        ]);
    }

    public function store(StoreSupportTicketRequest $request, CreateSupportTicketAction $action): JsonResponse
    {
        $ticket = $action->execute(
            $request->user(),
            $request->validated('type'),
            $request->validated('subject'),
            $request->validated('message'),
        );

        return response()->json(['data' => new SupportTicketResource($ticket->load('messages.author'))], 201);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        Gate::authorize('view', $ticket);

        return response()->json(['data' => new SupportTicketResource($ticket->load('messages.author'))]);
    }

    public function reply(SupportMessageRequest $request, SupportTicket $ticket, AddSupportMessageAction $action): JsonResponse
    {
        Gate::authorize('reply', $ticket);

        $action->execute($ticket, $request->user(), $request->validated('body'), asStaff: false);

        return response()->json(['data' => new SupportTicketResource($ticket->fresh()->load('messages.author'))], 201);
    }

    /** El usuario da por terminada su solicitud. */
    public function close(SupportTicket $ticket): JsonResponse
    {
        Gate::authorize('close', $ticket);

        $ticket->update(['status' => SupportTicket::STATUS_CLOSED, 'closed_at' => now()]);

        return response()->json(['data' => new SupportTicketResource($ticket->fresh()->load('messages.author'))]);
    }
}
