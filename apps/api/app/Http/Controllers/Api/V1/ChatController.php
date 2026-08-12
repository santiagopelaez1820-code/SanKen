<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Chat\Actions\GetOrCreateConversationAction;
use App\Application\Chat\Actions\SendMessageAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatConversation;
use App\Models\TrainerClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ChatController extends Controller
{
    private const RECENT_MESSAGES = 50;

    public function conversation(Request $request, TrainerClient $trainerClient, GetOrCreateConversationAction $action): JsonResponse
    {
        Gate::authorize('converse', $trainerClient);

        $conversation = $action->execute($trainerClient);
        $messages = $conversation->messages()->with('sender')->latest()->limit(self::RECENT_MESSAGES)->get()->reverse()->values();

        return response()->json(['data' => [
            'conversation_id' => $conversation->id,
            'messages' => ChatMessageResource::collection($messages),
        ]]);
    }

    /**
     * Inbox: toda conversación donde el usuario autenticado es alguna de las
     * dos partes, con último mensaje + no leídos. N+2 queries por
     * conversación (última + no leídos) — aceptable a esta escala, mismo
     * criterio de "no optimizar antes de necesitarlo" que el resto del MVP.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $trainerClientIds = TrainerClient::query()
            ->where(fn ($q) => $q->where('trainer_id', $user->id)->orWhere('client_id', $user->id))
            ->pluck('id');

        $conversations = ChatConversation::query()
            ->whereIn('trainer_client_id', $trainerClientIds)
            ->with('trainerClient.trainer', 'trainerClient.client')
            ->get()
            ->map(function (ChatConversation $conversation) use ($user) {
                $lastMessage = $conversation->messages()->latest()->first();
                $unreadCount = $conversation->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at')
                    ->count();
                $trainerClient = $conversation->trainerClient;
                $otherParty = $user->is($trainerClient->trainer) ? $trainerClient->client : $trainerClient->trainer;

                return [
                    'id' => $conversation->id,
                    'trainer_client_id' => $trainerClient->id,
                    'other_party' => ['id' => $otherParty->id, 'name' => $otherParty->name],
                    'last_message' => $lastMessage ? [
                        'body' => $lastMessage->body,
                        'sender_id' => $lastMessage->sender_id,
                        'created_at' => $lastMessage->created_at->toIso8601String(),
                    ] : null,
                    'unread_count' => $unreadCount,
                ];
            })
            ->sortByDesc(fn (array $c) => $c['last_message']['created_at'] ?? '')
            ->values();

        return response()->json(['data' => $conversations]);
    }

    public function messages(Request $request, ChatConversation $conversation): JsonResponse
    {
        Gate::authorize('converse', $conversation->trainerClient);

        $query = $conversation->messages()->with('sender')->latest();
        if ($before = $request->query('before')) {
            $query->where('id', '<', $before);
        }

        $messages = $query->limit(self::RECENT_MESSAGES)->get()->reverse()->values();

        // Pedir los mensajes de un hilo es la señal real de "el usuario lo
        // está mirando" — a diferencia de conversation(), que solo resuelve
        // trainerClientId → conversationId antes de navegar y nunca se usa
        // para pintar la pantalla en sí. Sin esto, unread_count en index()
        // nunca bajaría.
        $conversation->messages()
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['data' => ChatMessageResource::collection($messages)]);
    }

    public function sendMessage(SendMessageRequest $request, ChatConversation $conversation, SendMessageAction $action): JsonResponse
    {
        Gate::authorize('converse', $conversation->trainerClient);

        $message = $action->execute($conversation, $request->user(), $request->validated('body'));

        return response()->json(['data' => new ChatMessageResource($message->load('sender'))], 201);
    }
}
