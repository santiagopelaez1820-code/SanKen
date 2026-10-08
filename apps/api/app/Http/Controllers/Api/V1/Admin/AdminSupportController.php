<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar la acción que agrega un mensaje a una solicitud.
use App\Application\Support\Actions\AddSupportMessageAction;
// Esta línea sirve para importar la acción que actualiza una solicitud.
use App\Application\Support\Actions\UpdateSupportTicketAction;
// Esta línea sirve para importar el servicio que calcula las métricas de soporte.
use App\Domain\Support\Services\SupportStatsCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de un mensaje de soporte.
use App\Http\Requests\Support\SupportMessageRequest;
// Esta línea sirve para importar la validación de la actualización de una solicitud.
use App\Http\Requests\Support\UpdateSupportTicketRequest;
// Esta línea sirve para importar el resource que da formato a una solicitud.
use App\Http\Resources\SupportTicketResource;
// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar el atributo QueryParameter de Scramble para documentar parámetros.
use Dedoc\Scramble\Attributes\QueryParameter;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;
// Esta línea sirve para importar la clase Rule para armar reglas de validación.
use Illuminate\Validation\Rule;

/**
 * Panel de soporte del equipo (grupo de rutas role:super_admin, y además
 * SupportTicketPolicy::manage en cada acción sobre una solicitud).
 */
// Esta línea sirve para agrupar este controller en la sección "Admin · Soporte" de Swagger.
#[Group('Admin · Soporte', 'Bandeja de solicitudes de soporte del equipo: filtros, respuestas, asignación, estado y métricas.', weight: 27)]
// Esta línea sirve para declarar el controller del panel de soporte del equipo.
class AdminSupportController extends Controller
{
    /**
     * Listar solicitudes de soporte.
     *
     * Paginado de a 20, ordenado por prioridad y luego por actividad reciente.
     * `status=awaiting` trae las que esperan respuesta del equipo y `all`
     * (por defecto) todas.
     */
    // Esta línea sirve para documentar en Swagger el parámetro page.
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista las solicitudes de soporte.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para validar los filtros recibidos.
        $filters = $request->validate([
            // Esta línea sirve para aceptar como estado uno de los configurados, "awaiting" o "all".
            'status' => ['nullable', 'string', Rule::in([...config('support.ticket_statuses'), 'awaiting', 'all'])],
            // Esta línea sirve para aceptar como tipo uno de los configurados.
            'type' => ['nullable', 'string', Rule::in(config('support.ticket_types'))],
            // Esta línea sirve para aceptar como prioridad una de las configuradas.
            'priority' => ['nullable', 'string', Rule::in(config('support.ticket_priorities'))],
            // Esta línea sirve para aceptar un texto de búsqueda de hasta 100 caracteres.
            'q' => ['nullable', 'string', 'max:100'],
            // Esta línea sirve para aceptar un nombre o correo de usuario de hasta 100 caracteres.
            'user' => ['nullable', 'string', 'max:100'],
            // Esta línea sirve para aceptar una fecha desde.
            'from' => ['nullable', 'date'],
            // Esta línea sirve para aceptar una fecha hasta.
            'to' => ['nullable', 'date'],
            // Esta línea sirve para aceptar si solo se quieren las asignadas a uno mismo.
            'assigned_to_me' => ['nullable', 'boolean'],
        ]);

        // Esta línea sirve para usar el estado pedido o "all" por defecto.
        $status = $filters['status'] ?? 'all';

        // Esta línea sirve para consultar las solicitudes.
        $tickets = SupportTicket::query()
            // Esta línea sirve para cargar el usuario y el responsable asignado.
            ->with(['user', 'assignee'])
            // Esta línea sirve para filtrar las que esperan respuesta si se pidió "awaiting".
            ->when($status === 'awaiting', fn ($q) => $q->awaitingStaff())
            // Esta línea sirve para filtrar por un estado concreto si se pidió uno.
            ->when(! in_array($status, ['all', 'awaiting'], true), fn ($q) => $q->where('status', $status))
            // Esta línea sirve para filtrar por tipo si se envió.
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            // Esta línea sirve para filtrar por prioridad si se envió.
            ->when($filters['priority'] ?? null, fn ($q, $priority) => $q->where('priority', $priority))
            // Esta línea sirve para buscar el texto en el asunto si se envió.
            ->when($filters['q'] ?? null, fn ($q, $text) => $q->where(fn ($sub) => $sub
                // Esta línea sirve para buscar el texto dentro del asunto.
                ->where('subject', 'like', "%{$text}%")
                // Esta línea sirve para buscar el texto también dentro de los mensajes.
                ->orWhereHas('messages', fn ($m) => $m->where('body', 'like', "%{$text}%"))
                // Esta línea sirve para buscar también por número de solicitud si el texto es numérico.
                ->when(ctype_digit($text), fn ($s) => $s->orWhere('id', (int) $text))))
            // Esta línea sirve para filtrar por usuario si se envió.
            ->when($filters['user'] ?? null, fn ($q, $user) => $q->whereHas('user', fn ($u) => $u
                // Esta línea sirve para buscar el texto en el nombre del usuario.
                ->where('name', 'like', "%{$user}%")
                // Esta línea sirve para buscar el texto también en el correo del usuario.
                ->orWhere('email', 'like', "%{$user}%")))
            // Esta línea sirve para filtrar desde la fecha indicada.
            ->when($filters['from'] ?? null, fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            // Esta línea sirve para filtrar hasta la fecha indicada.
            ->when($filters['to'] ?? null, fn ($q, $to) => $q->whereDate('created_at', '<=', $to))
            // Esta línea sirve para filtrar solo las asignadas a quien consulta si se pidió.
            ->when($request->boolean('assigned_to_me'), fn ($q) => $q->where('assigned_to', $request->user()->id))
            // Esta línea sirve para ordenar por prioridad (urgente primero).
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END")
            // Esta línea sirve para ordenar luego por actividad más reciente.
            ->orderByDesc('last_message_at')
            // Esta línea sirve para paginar de a 20.
            ->paginate(20);

        // Esta línea sirve para responder con las solicitudes.
        return response()->json([
            // Esta línea sirve para incluir las solicitudes con el formato del equipo.
            'data' => $tickets->getCollection()->map(fn (SupportTicket $t) => SupportTicketResource::forStaff($t))->values(),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($tickets),
        ]);
    }

    /** Ver una solicitud de soporte con sus mensajes. */
    // Esta línea sirve para declarar el endpoint que muestra una solicitud.
    public function show(SupportTicket $ticket): JsonResponse
    {
        // Esta línea sirve para verificar que quien consulta puede gestionar la solicitud.
        Gate::authorize('manage', $ticket);

        // Esta línea sirve para responder con la solicitud, sus mensajes, el usuario y el responsable.
        return response()->json(['data' => SupportTicketResource::forStaff($ticket->load(['messages.author', 'user', 'assignee']))]);
    }

    /** Responder una solicitud como equipo de soporte. */
    // Esta línea sirve para declarar el endpoint que responde una solicitud como equipo.
    public function reply(SupportMessageRequest $request, SupportTicket $ticket, AddSupportMessageAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que quien responde puede gestionar la solicitud.
        Gate::authorize('manage', $ticket);

        // Esta línea sirve para agregar el mensaje como respuesta del equipo.
        $action->execute($ticket, $request->user(), $request->validated('body'), asStaff: true);

        // Esta línea sirve para responder con la solicitud actualizada y código 201.
        return response()->json(['data' => SupportTicketResource::forStaff($ticket->fresh()->load(['messages.author', 'user', 'assignee']))], 201);
    }

    /**
     * Actualizar una solicitud.
     *
     * Estado, prioridad o asignación (solo a miembros del equipo).
     */
    // Esta línea sirve para declarar el endpoint que actualiza una solicitud.
    public function update(UpdateSupportTicketRequest $request, SupportTicket $ticket, UpdateSupportTicketAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que quien edita puede gestionar la solicitud.
        Gate::authorize('manage', $ticket);

        // Esta línea sirve para aplicar los cambios de estado, prioridad o responsable.
        $ticket = $action->execute($ticket, $request->validated());

        // Esta línea sirve para responder con la solicitud actualizada.
        return response()->json(['data' => SupportTicketResource::forStaff($ticket->load(['messages.author', 'user', 'assignee']))]);
    }

    /**
     * Listar el equipo de soporte.
     *
     * Miembros del equipo a los que se puede asignar una solicitud.
     */
    // Esta línea sirve para declarar el endpoint que lista el equipo de soporte.
    public function staff(): JsonResponse
    {
        // Esta línea sirve para responder con el equipo.
        return response()->json([
            // Esta línea sirve para incluir los super admins ordenados por nombre, con su id y nombre.
            'data' => User::query()->where('role', 'super_admin')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /** Ver las métricas de soporte. */
    // Esta línea sirve para declarar el endpoint que devuelve las métricas de soporte.
    public function stats(SupportStatsCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para responder con las métricas calculadas.
        return response()->json(['data' => $calculator->calculate()]);
    }
}
