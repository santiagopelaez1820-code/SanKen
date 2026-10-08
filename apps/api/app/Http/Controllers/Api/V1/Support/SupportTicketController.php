<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de soporte.

namespace App\Http\Controllers\Api\V1\Support;

// Esta línea sirve para importar la acción que agrega un mensaje a una solicitud.
use App\Application\Support\Actions\AddSupportMessageAction;
// Esta línea sirve para importar la acción que crea una solicitud de soporte.
use App\Application\Support\Actions\CreateSupportTicketAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la creación de una solicitud.
use App\Http\Requests\Support\StoreSupportTicketRequest;
// Esta línea sirve para importar la validación de un mensaje de soporte.
use App\Http\Requests\Support\SupportMessageRequest;
// Esta línea sirve para importar el resource que da formato a una solicitud de soporte.
use App\Http\Resources\SupportTicketResource;
// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros de la URL.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

/**
 * Solicitudes del propio usuario. Todo se consulta desde $request->user():
 * un usuario nunca puede listar, abrir ni escribir en solicitudes ajenas
 * (SupportTicketPolicy lo verifica además en cada solicitud concreta).
 */
// Esta línea sirve para agrupar este controller en la sección "Soporte" de Swagger.
#[Group('Soporte', 'Solicitudes de soporte del usuario y check-in semanal.', weight: 21)]
// Esta línea sirve para declarar el controller de las solicitudes de soporte del usuario.
class SupportTicketController extends Controller
{
    /**
     * Listar mis solicitudes de soporte.
     *
     * Paginado de a 20, con la actividad más reciente primero.
     */
    // Esta línea sirve para documentar en Swagger el parámetro "page" (número de página).
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista las solicitudes del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las solicitudes del usuario.
        $tickets = $request->user()->supportTickets()
            // Esta línea sirve para ordenar por la actividad más reciente.
            ->orderByDesc('last_message_at')
            // Esta línea sirve para desempatar por id, de la más nueva a la más vieja.
            ->orderByDesc('id')
            // Esta línea sirve para paginar de a 20.
            ->paginate(20);

        // Esta línea sirve para responder con las solicitudes.
        return response()->json([
            // Esta línea sirve para incluir las solicitudes de esta página con su formato.
            'data' => SupportTicketResource::collection($tickets->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($tickets),
        ]);
    }

    /** Crear una solicitud de soporte. */
    // Esta línea sirve para declarar el endpoint que crea una solicitud de soporte.
    public function store(StoreSupportTicketRequest $request, CreateSupportTicketAction $action): JsonResponse
    {
        // Esta línea sirve para crear la solicitud con su primer mensaje.
        $ticket = $action->execute(
            // Esta línea sirve para pasar el usuario autenticado.
            $request->user(),
            // Esta línea sirve para pasar el tipo de solicitud.
            $request->validated('type'),
            // Esta línea sirve para pasar el asunto.
            $request->validated('subject'),
            // Esta línea sirve para pasar el mensaje.
            $request->validated('message'),
        );

        // Esta línea sirve para responder con la solicitud y sus mensajes con código 201.
        return response()->json(['data' => new SupportTicketResource($ticket->load('messages.author'))], 201);
    }

    /** Ver una solicitud con sus mensajes. */
    // Esta línea sirve para declarar el endpoint que muestra una solicitud.
    public function show(SupportTicket $ticket): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario puede ver la solicitud.
        Gate::authorize('view', $ticket);

        // Esta línea sirve para responder con la solicitud y sus mensajes con sus autores.
        return response()->json(['data' => new SupportTicketResource($ticket->load('messages.author'))]);
    }

    /** Responder en una solicitud. */
    // Esta línea sirve para declarar el endpoint que responde en una solicitud.
    public function reply(SupportMessageRequest $request, SupportTicket $ticket, AddSupportMessageAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario puede responder la solicitud.
        Gate::authorize('reply', $ticket);

        // Esta línea sirve para agregar el mensaje como usuario (no como staff).
        $action->execute($ticket, $request->user(), $request->validated('body'), asStaff: false);

        // Esta línea sirve para responder con la solicitud actualizada y código 201.
        return response()->json(['data' => new SupportTicketResource($ticket->fresh()->load('messages.author'))], 201);
    }

    /**
     * Cerrar una solicitud.
     *
     * El usuario da por terminada su solicitud.
     */
    // Esta línea sirve para declarar el endpoint que cierra una solicitud.
    public function close(SupportTicket $ticket): JsonResponse
    {
        // Esta línea sirve para verificar que el usuario puede cerrar la solicitud.
        Gate::authorize('close', $ticket);

        // Esta línea sirve para marcar la solicitud como cerrada y guardar la fecha.
        $ticket->update(['status' => SupportTicket::STATUS_CLOSED, 'closed_at' => now()]);

        // Esta línea sirve para responder con la solicitud actualizada.
        return response()->json(['data' => new SupportTicketResource($ticket->fresh()->load('messages.author'))]);
    }
}
