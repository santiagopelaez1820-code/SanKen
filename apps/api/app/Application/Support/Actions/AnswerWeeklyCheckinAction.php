<?php

namespace App\Application\Support\Actions;

use App\Models\SupportTicket;
use App\Models\WeeklyCheckin;
use Illuminate\Support\Facades\DB;

class AnswerWeeklyCheckinAction
{
    /**
     * "Tengo una duda / un reclamo / ..." del check-in → tipo de solicitud.
     * "Tengo un problema" (con mis entrenamientos) no es un problema técnico:
     * va como 'other' y el tema exacto queda en el contexto de la solicitud.
     */
    private const TOPIC_TO_TYPE = [
        'question' => 'question',
        'complaint' => 'complaint',
        'observation' => 'observation',
        'problem' => 'other',
        'suggestion' => 'suggestion',
    ];

    private const TOPIC_SUBJECT = [
        'question' => 'Duda',
        'complaint' => 'Reclamo',
        'observation' => 'Observación',
        'problem' => 'Problema con mis entrenamientos',
        'suggestion' => 'Sugerencia',
    ];

    public function __construct(
        private readonly CreateSupportTicketAction $createTicket,
    ) {}

    /**
     * Guarda la respuesta y, si el usuario quiere contar algo (tema distinto
     * de 'none'), crea una solicitud de soporte con el comentario y el
     * contexto de la semana — así el equipo puede responderle como a
     * cualquier otra solicitud.
     */
    public function execute(WeeklyCheckin $checkin, string $mood, string $topic, ?string $comment): ?SupportTicket
    {
        return DB::transaction(function () use ($checkin, $mood, $topic, $comment) {
            $checkin->forceFill([
                'status' => WeeklyCheckin::STATUS_ANSWERED,
                'mood' => $mood,
                'topic' => $topic,
                'answered_at' => now(),
                'shown_at' => $checkin->shown_at ?? now(),
                'postponed_until' => null,
            ])->save();

            if ($topic === 'none' || ! $comment) {
                return null;
            }

            return $this->createTicket->execute(
                $checkin->user,
                self::TOPIC_TO_TYPE[$topic],
                "Check-in semanal {$checkin->week}: ".self::TOPIC_SUBJECT[$topic],
                $comment,
                $checkin,
                [
                    'week' => $checkin->week,
                    'mood' => $mood,
                    'topic' => $topic,
                    ...($checkin->context ?? []),
                ],
            );
        });
    }
}
