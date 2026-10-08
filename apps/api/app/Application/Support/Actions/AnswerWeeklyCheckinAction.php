<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de soporte.

namespace App\Application\Support\Actions;

// Esta línea sirve para importar el modelo SupportTicket (solicitud de soporte).
use App\Models\SupportTicket;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

// Esta línea sirve para declarar la acción que guarda la respuesta del check-in semanal.
class AnswerWeeklyCheckinAction
{
    /**
     * "Tengo una duda / un reclamo / ..." del check-in → tipo de solicitud.
     * "Tengo un problema" (con mis entrenamientos) no es un problema técnico:
     * va como 'other' y el tema exacto queda en el contexto de la solicitud.
     */
    // Esta línea sirve para definir a qué tipo de solicitud corresponde cada tema del check-in.
    private const TOPIC_TO_TYPE = [
        // Esta línea sirve para registrar una duda como pregunta.
        'question' => 'question',
        // Esta línea sirve para registrar un reclamo como reclamo.
        'complaint' => 'complaint',
        // Esta línea sirve para registrar una observación como observación.
        'observation' => 'observation',
        // Esta línea sirve para registrar un problema con los entrenamientos como "otro".
        'problem' => 'other',
        // Esta línea sirve para registrar una sugerencia como sugerencia.
        'suggestion' => 'suggestion',
    ];

    // Esta línea sirve para definir el asunto de la solicitud según el tema elegido.
    private const TOPIC_SUBJECT = [
        // Esta línea sirve para definir el asunto para una duda.
        'question' => 'Duda',
        // Esta línea sirve para definir el asunto para un reclamo.
        'complaint' => 'Reclamo',
        // Esta línea sirve para definir el asunto para una observación.
        'observation' => 'Observación',
        // Esta línea sirve para definir el asunto para un problema con los entrenamientos.
        'problem' => 'Problema con mis entrenamientos',
        // Esta línea sirve para definir el asunto para una sugerencia.
        'suggestion' => 'Sugerencia',
    ];

    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir la acción que crea solicitudes de soporte.
        private readonly CreateSupportTicketAction $createTicket,
    ) {}

    /**
     * Guarda la respuesta y, si el usuario quiere contar algo (tema distinto
     * de 'none'), crea una solicitud de soporte con el comentario y el
     * contexto de la semana — así el equipo puede responderle como a
     * cualquier otra solicitud.
     */
    // Esta línea sirve para declarar el método que recibe el check-in, el ánimo, el tema y el comentario.
    public function execute(WeeklyCheckin $checkin, string $mood, string $topic, ?string $comment): ?SupportTicket
    {
        // Esta línea sirve para guardar todo dentro de una transacción y devolver la solicitud creada (o null).
        return DB::transaction(function () use ($checkin, $mood, $topic, $comment) {
            // Esta línea sirve para actualizar el check-in con la respuesta.
            $checkin->forceFill([
                // Esta línea sirve para marcarlo como respondido.
                'status' => WeeklyCheckin::STATUS_ANSWERED,
                // Esta línea sirve para guardar el estado de ánimo elegido.
                'mood' => $mood,
                // Esta línea sirve para guardar el tema elegido.
                'topic' => $topic,
                // Esta línea sirve para guardar la fecha en que se respondió.
                'answered_at' => now(),
                // Esta línea sirve para guardar cuándo se mostró, o ahora si no estaba registrado.
                'shown_at' => $checkin->shown_at ?? now(),
                // Esta línea sirve para borrar la fecha de aplazamiento.
                'postponed_until' => null,
                // Esta línea sirve para guardar los cambios en la base de datos.
            ])->save();

            // Esta línea sirve para revisar si no eligió tema o no dejó comentario.
            if ($topic === 'none' || ! $comment) {
                // Esta línea sirve para devolver null porque no hay que crear solicitud.
                return null;
            }

            // Esta línea sirve para crear la solicitud de soporte y devolverla.
            return $this->createTicket->execute(
                // Esta línea sirve para pasar el usuario del check-in.
                $checkin->user,
                // Esta línea sirve para pasar el tipo de solicitud según el tema.
                self::TOPIC_TO_TYPE[$topic],
                // Esta línea sirve para pasar el asunto con la semana y el tema.
                "Check-in semanal {$checkin->week}: ".self::TOPIC_SUBJECT[$topic],
                // Esta línea sirve para pasar el comentario como primer mensaje.
                $comment,
                // Esta línea sirve para pasar el check-in que originó la solicitud.
                $checkin,
                [
                    // Esta línea sirve para incluir en el contexto la semana del check-in.
                    'week' => $checkin->week,
                    // Esta línea sirve para incluir el estado de ánimo.
                    'mood' => $mood,
                    // Esta línea sirve para incluir el tema.
                    'topic' => $topic,
                    // Esta línea sirve para incluir el contexto adicional que tenga el check-in.
                    ...($checkin->context ?? []),
                ],
            );
        });
    }
}
