<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que obtiene o crea una conversación.
use App\Application\Chat\Actions\GetOrCreateConversationAction;
// Esta línea sirve para importar la acción que envía un mensaje.
use App\Application\Chat\Actions\SendMessageAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de un mensaje.
use App\Http\Requests\Chat\SendMessageRequest;
// Esta línea sirve para importar el resource que da formato a un mensaje.
use App\Http\Resources\ChatMessageResource;
// Esta línea sirve para importar el modelo ChatConversation (conversación).
use App\Models\ChatConversation;
// Esta línea sirve para importar el modelo TrainerClient (relación entrenador-cliente).
use App\Models\TrainerClient;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Chat" de Swagger.
#[Group('Chat', 'Mensajería entre entrenador y cliente.', weight: 16)]
// Esta línea sirve para declarar el controller del chat.
class ChatController extends Controller
{
    // Esta línea sirve para definir cuántos mensajes recientes se devuelven (50).
    private const RECENT_MESSAGES = 50;

    /**
     * Abrir la conversación de una relación entrenador-cliente.
     *
     * Devuelve la conversación (la crea si no existe) con sus últimos 50
     * mensajes.
     */
    // Esta línea sirve para declarar el endpoint que abre la conversación de una relación.
    public function conversation(Request $request, TrainerClient $trainerClient, GetOrCreateConversationAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario participa en la relación.
        Gate::authorize('converse', $trainerClient);

        // Esta línea sirve para obtener o crear la conversación.
        $conversation = $action->execute($trainerClient);
        // Esta línea sirve para obtener los últimos 50 mensajes en orden cronológico.
        $messages = $conversation->messages()->with('sender')->latest()->limit(self::RECENT_MESSAGES)->get()->reverse()->values();

        // Esta línea sirve para responder con la conversación.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el id de la conversación.
            'conversation_id' => $conversation->id,
            // Esta línea sirve para incluir los mensajes con su formato.
            'messages' => ChatMessageResource::collection($messages),
        ]]);
    }

    /**
     * Listar mis conversaciones.
     *
     * Inbox: toda conversación donde el usuario autenticado es alguna de las
     * dos partes, con último mensaje + no leídos. N+2 queries por
     * conversación (última + no leídos) — aceptable a esta escala, mismo
     * criterio de "no optimizar antes de necesitarlo" que el resto del MVP.
     *
     * @response array{data: list<array{
     *     id: int,
     *     trainer_client_id: int,
     *     other_party: array{id: int, name: string},
     *     last_message: array{body: string, sender_id: int, created_at: string}|null,
     *     unread_count: int,
     * }>}
     */
    // Esta línea sirve para declarar el endpoint que lista las conversaciones del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para consultar las relaciones del usuario.
        $trainerClientIds = TrainerClient::query()
            // Esta línea sirve para filtrar las relaciones donde es entrenador o cliente.
            ->where(fn ($q) => $q->where('trainer_id', $user->id)->orWhere('client_id', $user->id))
            // Esta línea sirve para obtener solo sus ids.
            ->pluck('id');

        // Esta línea sirve para consultar las conversaciones de esas relaciones.
        $conversations = ChatConversation::query()
            // Esta línea sirve para filtrar por las relaciones del usuario.
            ->whereIn('trainer_client_id', $trainerClientIds)
            // Esta línea sirve para cargar el entrenador y el cliente de cada una.
            ->with('trainerClient.trainer', 'trainerClient.client')
            // Esta línea sirve para ejecutar la consulta.
            ->get()
            // Esta línea sirve para transformar cada conversación en un elemento de la bandeja.
            ->map(function (ChatConversation $conversation) use ($user) {
                // Esta línea sirve para obtener el último mensaje.
                $lastMessage = $conversation->messages()->latest()->first();
                // Esta línea sirve para contar los mensajes no leídos.
                $unreadCount = $conversation->messages()
                    // Esta línea sirve para filtrar los enviados por la otra persona.
                    ->where('sender_id', '!=', $user->id)
                    // Esta línea sirve para filtrar los que no tienen fecha de lectura.
                    ->whereNull('read_at')
                    // Esta línea sirve para contarlos.
                    ->count();
                // Esta línea sirve para obtener la relación entrenador-cliente.
                $trainerClient = $conversation->trainerClient;
                // Esta línea sirve para elegir a la otra persona de la conversación.
                $otherParty = $user->is($trainerClient->trainer) ? $trainerClient->client : $trainerClient->trainer;

                // Esta línea sirve para devolver el elemento de la bandeja.
                return [
                    // Esta línea sirve para incluir el id de la conversación.
                    'id' => $conversation->id,
                    // Esta línea sirve para incluir el id de la relación.
                    'trainer_client_id' => $trainerClient->id,
                    // Esta línea sirve para incluir el id y nombre de la otra persona.
                    'other_party' => ['id' => $otherParty->id, 'name' => $otherParty->name],
                    // Esta línea sirve para incluir el último mensaje, si existe.
                    'last_message' => $lastMessage ? [
                        // Esta línea sirve para incluir el texto del último mensaje.
                        'body' => $lastMessage->body,
                        // Esta línea sirve para incluir quién lo envió.
                        'sender_id' => $lastMessage->sender_id,
                        // Esta línea sirve para incluir la fecha en formato ISO.
                        'created_at' => $lastMessage->created_at->toIso8601String(),
                        // Esta línea sirve para cerrar el último mensaje (o null si no hay).
                    ] : null,
                    // Esta línea sirve para incluir la cantidad de no leídos.
                    'unread_count' => $unreadCount,
                ];
            })
            // Esta línea sirve para ordenar por el último mensaje, del más reciente al más antiguo.
            ->sortByDesc(fn (array $c) => $c['last_message']['created_at'] ?? '')
            // Esta línea sirve para reindexar la lista.
            ->values();

        // Esta línea sirve para responder con las conversaciones.
        return response()->json(['data' => $conversations]);
    }

    /**
     * Listar los mensajes de una conversación.
     *
     * Los 50 más recientes; `before` (id de un mensaje) trae los anteriores a
     * ese. Marca como leídos los mensajes recibidos.
     */
    // Esta línea sirve para declarar el endpoint que lista los mensajes de una conversación.
    public function messages(Request $request, ChatConversation $conversation): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario participa en la conversación.
        Gate::authorize('converse', $conversation->trainerClient);

        // Esta línea sirve para consultar los mensajes con su autor, del más reciente al más antiguo.
        $query = $conversation->messages()->with('sender')->latest();
        // Esta línea sirve para revisar si se pidió paginar hacia atrás con "before".
        if ($before = $request->query('before')) {
            // Esta línea sirve para traer solo los mensajes anteriores a ese id.
            $query->where('id', '<', $before);
        }

        // Esta línea sirve para obtener los 50 mensajes en orden cronológico.
        $messages = $query->limit(self::RECENT_MESSAGES)->get()->reverse()->values();

        // Pedir los mensajes de un hilo es la señal real de "el usuario lo
        // está mirando" — a diferencia de conversation(), que solo resuelve
        // trainerClientId → conversationId antes de navegar y nunca se usa
        // para pintar la pantalla en sí. Sin esto, unread_count en index()
        // nunca bajaría.
        // Esta línea sirve para consultar los mensajes de la conversación.
        $conversation->messages()
            // Esta línea sirve para filtrar los enviados por la otra persona.
            ->where('sender_id', '!=', $request->user()->id)
            // Esta línea sirve para filtrar los que no tienen fecha de lectura.
            ->whereNull('read_at')
            // Esta línea sirve para marcarlos como leídos ahora.
            ->update(['read_at' => now()]);

        // Esta línea sirve para responder con los mensajes con su formato.
        return response()->json(['data' => ChatMessageResource::collection($messages)]);
    }

    /**
     * Enviar un mensaje.
     *
     * Se emite en tiempo real a la conversación abierta y el destinatario
     * recibe una notificación.
     */
    // Esta línea sirve para declarar el endpoint que envía un mensaje.
    public function sendMessage(SendMessageRequest $request, ChatConversation $conversation, SendMessageAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario participa en la conversación.
        Gate::authorize('converse', $conversation->trainerClient);

        // Esta línea sirve para enviar el mensaje.
        $message = $action->execute($conversation, $request->user(), $request->validated('body'));

        // Esta línea sirve para responder con el mensaje creado y código 201.
        return response()->json(['data' => new ChatMessageResource($message->load('sender'))], 201);
    }
}
