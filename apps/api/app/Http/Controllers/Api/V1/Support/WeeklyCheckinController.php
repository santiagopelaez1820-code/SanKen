<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de soporte.

namespace App\Http\Controllers\Api\V1\Support;

// Esta línea sirve para importar la acción que guarda la respuesta del check-in semanal.
use App\Application\Support\Actions\AnswerWeeklyCheckinAction;
// Esta línea sirve para importar el servicio con las reglas del check-in semanal.
use App\Domain\Support\Services\WeeklyCheckinService;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la respuesta del check-in.
use App\Http\Requests\Support\AnswerWeeklyCheckinRequest;
// Esta línea sirve para importar el resource que da formato a una solicitud de soporte.
use App\Http\Resources\SupportTicketResource;
// Esta línea sirve para importar el resource que da formato a un check-in semanal.
use App\Http\Resources\WeeklyCheckinResource;
// Esta línea sirve para importar el modelo WeeklyCheckin (check-in semanal).
use App\Models\WeeklyCheckin;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Soporte" de Swagger.
#[Group('Soporte', weight: 21)]
// Esta línea sirve para declarar el controller del check-in semanal.
class WeeklyCheckinController extends Controller
{
    /**
     * Obtener el check-in de esta semana.
     *
     * Check-in de esta semana. La app lo consulta al abrirse: `should_prompt`
     * dice si hay que mostrarlo ahora (pendiente, o pospuesto y ya pasó el
     * plazo). Al mostrarse se registra shown_at. Fuera de la ventana
     * (lunes-jueves) o si el usuario no es elegible, `checkin` es null.
     */
    // Esta línea sirve para declarar el endpoint que devuelve el check-in de esta semana.
    public function current(Request $request, WeeklyCheckinService $service): JsonResponse
    {
        // Esta línea sirve para obtener el check-in de esta semana del usuario.
        $checkin = $service->currentFor($request->user());
        // Esta línea sirve para calcular si hay que mostrarlo ahora.
        $shouldPrompt = $checkin && $service->shouldPrompt($checkin);

        // Esta línea sirve para revisar si hay que mostrarlo.
        if ($shouldPrompt) {
            // Esta línea sirve para registrar que se mostró.
            $service->markShown($checkin);
        }

        // Esta línea sirve para responder con los datos.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el check-in con su formato, o null si no hay.
            'checkin' => $checkin ? new WeeklyCheckinResource($checkin) : null,
            // Esta línea sirve para incluir si hay que mostrarlo.
            'should_prompt' => $shouldPrompt,
        ]]);
    }

    /**
     * Responder el check-in semanal.
     *
     * Si el usuario elige un tema (distinto de `none`) y deja un comentario,
     * se crea además una solicitud de soporte, que viene en `ticket`.
     */
    // Esta línea sirve para declarar el endpoint que responde el check-in semanal.
    public function answer(AnswerWeeklyCheckinRequest $request, WeeklyCheckin $checkin, WeeklyCheckinService $service, AnswerWeeklyCheckinAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que el check-in se puede responder.
        $this->ensureAnswerable($request, $checkin, $service);

        // Esta línea sirve para guardar la respuesta (y crear una solicitud de soporte si corresponde).
        $ticket = $action->execute(
            // Esta línea sirve para pasar el check-in.
            $checkin,
            // Esta línea sirve para pasar el estado de ánimo.
            $request->validated('mood'),
            // Esta línea sirve para pasar el tema elegido.
            $request->validated('topic'),
            // Esta línea sirve para pasar el comentario.
            $request->validated('comment'),
        );

        // Esta línea sirve para responder con los datos.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el check-in actualizado.
            'checkin' => new WeeklyCheckinResource($checkin->fresh()),
            // Esta línea sirve para incluir la solicitud creada con sus mensajes, o null si no se creó.
            'ticket' => $ticket ? new SupportTicketResource($ticket->load('messages.author')) : null,
        ]]);
    }

    /**
     * Posponer el check-in semanal.
     *
     * Se vuelve a mostrar más tarde (24 h por defecto); al llegar al máximo de
     * aplazamientos (2 por defecto) queda descartado por esa semana.
     */
    // Esta línea sirve para declarar el endpoint que pospone el check-in semanal.
    public function postpone(Request $request, WeeklyCheckin $checkin, WeeklyCheckinService $service): JsonResponse
    {
        // Esta línea sirve para verificar que el check-in se puede responder.
        $this->ensureAnswerable($request, $checkin, $service);

        // Esta línea sirve para responder con los datos.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el check-in pospuesto.
            'checkin' => new WeeklyCheckinResource($service->postpone($checkin)),
        ]]);
    }

    /**
     * Solo el dueño, solo el check-in de la semana en curso y solo si no fue
     * respondido ya: no se puede responder (ni reescribir) un check-in de otra
     * persona, de una semana pasada, ni dos veces el mismo.
     */
    // Esta línea sirve para declarar el método privado que verifica que el check-in se pueda responder.
    private function ensureAnswerable(Request $request, WeeklyCheckin $checkin, WeeklyCheckinService $service): void
    {
        // Esta línea sirve para responder 404 si el check-in no es del usuario.
        abort_unless($checkin->user_id === $request->user()->id, 404);

        // Esta línea sirve para revisar si ya fue respondido.
        if ($checkin->status === WeeklyCheckin::STATUS_ANSWERED) {
            // Esta línea sirve para lanzar un error 422 que avisa que ya se respondió.
            throw ValidationException::withMessages(['checkin' => ['Ya respondiste el check-in de esta semana.']]);
        }

        // Esta línea sirve para revisar si no es de la semana actual.
        if (! $service->isCurrentWeek($checkin)) {
            // Esta línea sirve para lanzar un error 422 que avisa que ya no está disponible.
            throw ValidationException::withMessages(['checkin' => ['Este check-in ya no está disponible.']]);
        }
    }
}
