<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte) para tipar el resource.
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo SupportTicketMessage (mensaje de una solicitud).
use App\Models\SupportTicketMessage;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Misma forma para el usuario y para el equipo, pero lo interno (prioridad,
 * responsable, contexto del check-in, datos del usuario) solo va en la
 * vista del equipo — usar SupportTicketResource::forStaff().
 *
 * @mixin SupportTicket
 */
// Esta línea sirve para declarar el resource que da formato a una solicitud de soporte.
class SupportTicketResource extends JsonResource
{
    // Esta línea sirve para guardar si se arma la vista del equipo (con datos internos).
    private bool $staffView = false;

    // Esta línea sirve para declarar el método que crea el resource con la vista del equipo.
    public static function forStaff(SupportTicket $ticket): static
    {
        // Esta línea sirve para crear el resource con la solicitud.
        $resource = new static($ticket);
        // Esta línea sirve para activar la vista del equipo.
        $resource->staffView = true;

        // Esta línea sirve para devolver el resource.
        return $resource;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la solicitud en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el tipo.
            'type' => $this->type,
            // Esta línea sirve para incluir el asunto.
            'subject' => $this->subject,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir el origen de la solicitud.
            'source' => $this->source,
            // Esta línea sirve para incluir el id del check-in que la originó.
            'weekly_checkin_id' => $this->weekly_checkin_id,
            // Esta línea sirve para incluir la fecha del último mensaje en formato ISO 8601.
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            // Esta línea sirve para indicar si el último mensaje lo escribió el equipo.
            'last_message_by_staff' => $this->last_message_by_staff,
            // Esta línea sirve para incluir cuándo respondió el equipo por primera vez.
            'first_response_at' => $this->first_response_at?->toIso8601String(),
            // Esta línea sirve para incluir cuándo se resolvió.
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            // Esta línea sirve para incluir cuándo se cerró.
            'closed_at' => $this->closed_at?->toIso8601String(),
            // Esta línea sirve para incluir la fecha de creación.
            'created_at' => $this->created_at?->toIso8601String(),
            // Esta línea sirve para incluir los mensajes solo si se cargaron, cada uno con su formato.
            /** @var list<array{id: int, body: string, is_staff: bool, author_name: string|null, created_at: string|null}> */
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(fn (SupportTicketMessage $message) => [
                // Esta línea sirve para incluir el id del mensaje.
                'id' => $message->id,
                // Esta línea sirve para incluir el texto del mensaje.
                'body' => $message->body,
                // Esta línea sirve para indicar si lo escribió el equipo.
                'is_staff' => $message->is_staff,
                // Al usuario se le muestra "Equipo SanKen", no el nombre de
                // quién respondió; el equipo sí ve el nombre.
                // Esta línea sirve para ocultar al usuario el nombre del autor si respondió el equipo.
                'author_name' => $message->is_staff && ! $this->staffView
                    // Esta línea sirve para usar null en ese caso.
                    ? null
                    // Esta línea sirve para usar el nombre del autor en los demás casos.
                    : $message->author?->name,
                // Esta línea sirve para incluir la fecha del mensaje.
                'created_at' => $message->created_at?->toIso8601String(),
                // Esta línea sirve para reindexar la lista de mensajes.
            ])->values()),
            // Esta línea sirve para agregar los datos internos solo en la vista del equipo.
            $this->mergeWhen($this->staffView, fn () => [
                // Esta línea sirve para incluir la prioridad.
                'priority' => $this->priority,
                // Esta línea sirve para incluir el contexto.
                'context' => $this->context,
                // Esta línea sirve para incluir los datos del usuario si existe.
                'user' => $this->user ? [
                    // Esta línea sirve para incluir el id del usuario.
                    'id' => $this->user->id,
                    // Esta línea sirve para incluir el nombre del usuario.
                    'name' => $this->user->name,
                    // Esta línea sirve para incluir el correo del usuario.
                    'email' => $this->user->email,
                    // Esta línea sirve para usar null si el usuario no existe.
                ] : null,
                // Esta línea sirve para incluir el responsable asignado (o null).
                'assignee' => $this->assignee ? ['id' => $this->assignee->id, 'name' => $this->assignee->name] : null,
            ]),
        ];
    }
}
