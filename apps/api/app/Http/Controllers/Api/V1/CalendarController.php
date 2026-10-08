<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que decide qué día de rutina toca.
use App\Application\Routine\Actions\DetermineNextRoutineDayAction;
// Esta línea sirve para importar el contrato del repositorio de rutinas.
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación del mes pedido.
use App\Http\Requests\Calendar\CalendarMonthRequest;
// Esta línea sirve para importar la validación de un recordatorio.
use App\Http\Requests\Calendar\StoreCalendarReminderRequest;
// Esta línea sirve para importar el resource que da formato a un recordatorio.
use App\Http\Resources\CalendarReminderResource;
// Esta línea sirve para importar el modelo CalendarReminder (recordatorio).
use App\Models\CalendarReminder;
// Esta línea sirve para importar el modelo MuscleGroup (grupo muscular).
use App\Models\MuscleGroup;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar Carbon para manejar fechas.
use Carbon\Carbon;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Calendario" de Swagger.
#[Group('Calendario', 'Calendario mensual de entrenamientos y recordatorios personales.', weight: 13)]
// Esta línea sirve para declarar el controller del calendario.
class CalendarController extends Controller
{
    /**
     * Ver el calendario de un mes.
     *
     * Arma el calendario del mes leyendo directo de workout_sessions
     * (completados) + calendar_reminders + el entrenamiento sugerido de HOY
     * (mismo DetermineNextRoutineDayAction que ya usa /routines/active) —
     * a propósito no hay proyección a futuro, ver docs/02 y el plan del
     * Sprint 10: las rutinas no tienen un día de la semana fijo.
     *
     * Los eventos `workout_completed`/`workout_planned` traen
     * `duration_minutes` y `muscle_groups`; los `reminder`, `id` y `notes`.
     *
     * @response array{data: array{
     *     month: string,
     *     events: list<array{
     *         type: 'workout_completed'|'workout_planned'|'reminder',
     *         event_date: string,
     *         title: string,
     *         duration_minutes?: int|null,
     *         muscle_groups?: list<string>,
     *         id?: int,
     *         notes?: string|null,
     *     }>,
     * }}
     */
    // Esta línea sirve para declarar el endpoint que arma el calendario de un mes.
    public function index(
        // Esta línea sirve para recibir el mes validado.
        CalendarMonthRequest $request,
        // Esta línea sirve para recibir el repositorio de rutinas.
        RoutineRepositoryInterface $routines,
        // Esta línea sirve para recibir la acción que decide el próximo día de rutina.
        DetermineNextRoutineDayAction $nextDay,
        // Esta línea sirve para indicar que el método devuelve una respuesta JSON.
    ): JsonResponse {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();
        // Esta línea sirve para calcular el primer día del mes pedido.
        $monthStart = Carbon::createFromFormat('Y-m', $request->validated('month'))->startOfMonth();
        // Esta línea sirve para calcular el último día del mes.
        $monthEnd = $monthStart->clone()->endOfMonth();

        // whereDate() en vez de whereBetween() con strings "Y-m-d": el cast
        // `date` de performed_at/event_date persiste como datetime completo
        // (Y-m-d H:i:s) al guardar, así que un whereBetween ingenuo excluiría
        // en silencio lo que caiga justo el último día del mes (mismo caso
        // ya documentado en ChallengeProgressCalculator/AggregateDailyStatsAction).
        // Esta línea sirve para consultar los entrenamientos del mes.
        $events = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar solo los completados.
            ->where('completed', true)
            // Esta línea sirve para filtrar desde el primer día del mes.
            ->whereDate('performed_at', '>=', $monthStart->toDateString())
            // Esta línea sirve para filtrar hasta el último día del mes.
            ->whereDate('performed_at', '<=', $monthEnd->toDateString())
            // Esta línea sirve para cargar el día de rutina y los ejercicios con su músculo.
            ->with('routineDay', 'exercises.exercise.primaryMuscle')
            // Esta línea sirve para ejecutar la consulta.
            ->get()
            // Esta línea sirve para convertir cada sesión en un evento del calendario.
            ->map(fn (WorkoutSession $session) => [
                // Esta línea sirve para marcar el evento como entrenamiento completado.
                'type' => 'workout_completed',
                // Esta línea sirve para guardar la fecha del entrenamiento.
                'event_date' => $session->performed_at->toDateString(),
                // Esta línea sirve para usar el nombre del día de rutina, o "Entrenamiento".
                'title' => $session->routineDay?->label ?? 'Entrenamiento',
                // Esta línea sirve para guardar la duración en minutos.
                'duration_minutes' => $session->duration_minutes,
                // Grupos musculares REALMENTE trabajados (de los ejercicios
                // efectivamente cargados en esta sesión), no lo que la rutina
                // planeaba — un ejercicio agregado/cambiado a mitad de sesión
                // ya queda reflejado acá.
                // Esta línea sirve para calcular los grupos musculares trabajados.
                'muscle_groups' => $session->exercises
                    // Esta línea sirve para tomar el músculo principal de cada ejercicio.
                    ->pluck('exercise.primaryMuscle.name')
                    // Esta línea sirve para quitar los vacíos.
                    ->filter()
                    // Esta línea sirve para quitar los repetidos.
                    ->unique()
                    // Esta línea sirve para reindexar la lista.
                    ->values()
                    // Esta línea sirve para convertir en arreglo.
                    ->all(),
            ])
            // Esta línea sirve para reindexar la lista de eventos.
            ->values();

        // Esta línea sirve para guardar la fecha de hoy.
        $today = Carbon::today();
        // Esta línea sirve para revisar si hoy cae dentro del mes pedido.
        if ($today->between($monthStart, $monthEnd)) {
            // Esta línea sirve para buscar la rutina activa del usuario.
            $routine = $routines->findActiveForUser($user);
            // Esta línea sirve para calcular el próximo día de rutina (o null si no hay rutina).
            $day = $routine ? $nextDay->execute($routine->loadMissing('days')) : null;

            // Esta línea sirve para revisar si hay un próximo día.
            if ($day !== null) {
                // target_muscle_groups guarda slugs (ver TemplateRoutineGenerator),
                // no el nombre en español que se muestra acá.
                // Esta línea sirve para consultar los grupos musculares del día.
                $muscleNames = MuscleGroup::query()
                    // Esta línea sirve para filtrar por los slugs del día.
                    ->whereIn('slug', $day->target_muscle_groups ?? [])
                    // Esta línea sirve para obtener sus nombres.
                    ->pluck('name');

                // Esta línea sirve para agregar el entrenamiento planeado de hoy al calendario.
                $events->push([
                    // Esta línea sirve para marcar el evento como entrenamiento planeado.
                    'type' => 'workout_planned',
                    // Esta línea sirve para guardar la fecha de hoy.
                    'event_date' => $today->toDateString(),
                    // Esta línea sirve para usar el nombre del día de rutina.
                    'title' => $day->label,
                    // Esta línea sirve para dejar la duración sin definir.
                    'duration_minutes' => null,
                    // Esta línea sirve para guardar los nombres de los grupos musculares.
                    'muscle_groups' => $muscleNames->values()->all(),
                ]);
            }
        }

        // Esta línea sirve para consultar los recordatorios del mes.
        $reminders = CalendarReminder::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $user->id)
            // Esta línea sirve para filtrar desde el primer día del mes.
            ->whereDate('event_date', '>=', $monthStart->toDateString())
            // Esta línea sirve para filtrar hasta el último día del mes.
            ->whereDate('event_date', '<=', $monthEnd->toDateString())
            // Esta línea sirve para ordenar por fecha.
            ->orderBy('event_date')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para combinar entrenamientos y recordatorios.
        $events = $events
            // Esta línea sirve para sumar los recordatorios con su formato.
            ->concat(CalendarReminderResource::collection($reminders)->resolve())
            // Esta línea sirve para ordenar todos los eventos por fecha.
            ->sortBy('event_date')
            // Esta línea sirve para reindexar la lista.
            ->values();

        // Esta línea sirve para responder con el calendario.
        return response()->json(['data' => [
            // Esta línea sirve para incluir el mes pedido.
            'month' => $request->validated('month'),
            // Esta línea sirve para incluir los eventos.
            'events' => $events,
        ]]);
    }

    /** Crear un recordatorio. */
    // Esta línea sirve para declarar el endpoint que crea un recordatorio.
    public function storeReminder(StoreCalendarReminderRequest $request): JsonResponse
    {
        // Esta línea sirve para crear el recordatorio.
        $reminder = CalendarReminder::query()->create([
            // Esta línea sirve para guardar el id del usuario.
            'user_id' => $request->user()->id,
            // Esta línea sirve para guardar la fecha del recordatorio.
            'event_date' => $request->validated('event_date'),
            // Esta línea sirve para guardar el título.
            'title' => $request->validated('title'),
            // Esta línea sirve para guardar las notas.
            'notes' => $request->validated('notes'),
        ]);

        // Esta línea sirve para responder con el recordatorio creado y código 201.
        return response()->json(['data' => new CalendarReminderResource($reminder)], 201);
    }

    /** Eliminar un recordatorio. */
    // Esta línea sirve para declarar el endpoint que elimina un recordatorio.
    public function destroyReminder(Request $request, CalendarReminder $reminder): JsonResponse
    {
        // Esta línea sirve para verificar que el recordatorio es del usuario.
        Gate::authorize('delete', $reminder);

        // Esta línea sirve para borrar el recordatorio.
        $reminder->delete();

        // Esta línea sirve para responder con código 204 (sin contenido).
        return response()->json(status: 204);
    }
}
