<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que registra un récord personal manual.
use App\Application\Stats\Actions\RegisterManualPersonalRecordAction;
// Esta línea sirve para importar el servicio que calcula la racha de entrenamientos.
use App\Domain\Stats\Services\StreakCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la consulta de evolución.
use App\Http\Requests\Stats\ProgressQueryRequest;
// Esta línea sirve para importar la validación del registro de un récord personal.
use App\Http\Requests\Stats\RegisterPersonalRecordRequest;
// Esta línea sirve para importar la validación de la consulta de volumen.
use App\Http\Requests\Stats\VolumeQueryRequest;
// Esta línea sirve para importar el resource que da formato a un récord personal.
use App\Http\Resources\PersonalRecordResource;
// Esta línea sirve para importar el modelo BodyMeasurement (medida corporal).
use App\Models\BodyMeasurement;
// Esta línea sirve para importar el modelo ChallengeParticipant (participación en un reto).
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar el modelo PersonalRecord (récord personal).
use App\Models\PersonalRecord;
// Esta línea sirve para importar el modelo UserStatsDaily (estadísticas diarias del usuario).
use App\Models\UserStatsDaily;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar CarbonImmutable para manejar fechas sin modificarlas.
use Carbon\CarbonImmutable;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase Collection para tipar colecciones.
use Illuminate\Support\Collection;
// Esta línea sirve para importar la fachada Cache para guardar datos en caché.
use Illuminate\Support\Facades\Cache;

// Esta línea sirve para agrupar este controller en la sección "Progreso y estadísticas" de Swagger.
#[Group('Progreso y estadísticas', 'Resumen del dashboard, volumen por grupo muscular, récords personales, evolución de métricas y medidas corporales.', weight: 8)]
// Esta línea sirve para declarar el controller de estadísticas.
class StatsController extends Controller
{
    /**
     * Obtener el resumen del dashboard.
     *
     * Totales históricos (horas, series y volumen), racha actual,
     * entrenamientos y retos completados y los 5 récords más recientes.
     */
    // Esta línea sirve para declarar el endpoint que devuelve el resumen del dashboard.
    public function dashboard(Request $request, StreakCalculator $streakCalculator): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();

        // Esta línea sirve para guardar en caché por una hora el resumen calculado (o leerlo si ya estaba).
        $data = Cache::remember(CacheKeys::statsDashboard($user->id), now()->addHour(), function () use ($user, $streakCalculator) {
            // Esta línea sirve para consultar las estadísticas diarias del usuario.
            $totals = UserStatsDaily::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para sumar series, volumen y minutos de entrenamiento.
                ->selectRaw('SUM(total_sets) as total_sets, SUM(total_volume_kg) as total_volume_kg, SUM(training_minutes) as training_minutes')
                // Esta línea sirve para obtener la fila con los totales.
                ->first();

            // Esta línea sirve para consultar las fechas en que entrenó.
            $workoutDates = WorkoutSession::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar solo las sesiones completadas.
                ->where('completed', true)
                // Esta línea sirve para quitar los repetidos.
                ->distinct()
                // Esta línea sirve para obtener solo la fecha de cada sesión.
                ->pluck('performed_at')
                // Esta línea sirve para convertir cada fecha a texto AAAA-MM-DD.
                ->map(fn ($date) => $date->toDateString())
                // Esta línea sirve para convertir la colección en arreglo.
                ->all();

            // Esta línea sirve para calcular la racha actual de días entrenando.
            $streak = $streakCalculator->calculate($workoutDates, CarbonImmutable::now());

            // Esta línea sirve para consultar los récords personales recientes.
            $recentPrs = PersonalRecord::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para cargar el ejercicio de cada récord.
                ->with('exercise')
                // Esta línea sirve para ordenar del más reciente al más antiguo.
                ->orderByDesc('achieved_at')
                // Esta línea sirve para limitar a 5 récords.
                ->limit(5)
                // Esta línea sirve para ejecutar la consulta.
                ->get();

            // `count(workoutDates)` no sirve para esto: son fechas únicas (para
            // la racha), no sesiones — un día con 2 entrenamientos cuenta 1 acá.
            // Esta línea sirve para consultar el total de entrenamientos.
            $totalWorkouts = WorkoutSession::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar solo las sesiones completadas.
                ->where('completed', true)
                // Esta línea sirve para contarlas.
                ->count();

            // A diferencia de GET /challenges (que solo devuelve retos del
            // período activo), esto cuenta TODA la historia del usuario — es
            // la única forma honesta de mostrar "N retos completados" en el
            // perfil sin inventar un número que se resetea cada semana/mes.
            // Esta línea sirve para consultar el total de retos completados.
            $completedChallenges = ChallengeParticipant::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar solo las participaciones completadas.
                ->where('completed', true)
                // Esta línea sirve para contarlas.
                ->count();

            // Esta línea sirve para devolver el resumen que se guarda en caché.
            return [
                // Esta línea sirve para incluir las horas totales (minutos / 60) con un decimal.
                'total_hours' => round((float) ($totals->training_minutes ?? 0) / 60, 1),
                // Esta línea sirve para incluir el total de series.
                'total_sets' => (int) ($totals->total_sets ?? 0),
                // Esta línea sirve para incluir el volumen total en kilos con 2 decimales.
                'total_volume_kg' => round((float) ($totals->total_volume_kg ?? 0), 2),
                // Esta línea sirve para incluir la racha actual.
                'current_streak_days' => $streak,
                // Esta línea sirve para incluir el total de entrenamientos.
                'total_workouts' => $totalWorkouts,
                // Esta línea sirve para incluir el total de retos completados.
                'completed_challenges' => $completedChallenges,
                // Esta línea sirve para incluir los récords recientes ya convertidos en arreglo.
                'recent_personal_records' => PersonalRecordResource::collection($recentPrs)->resolve(),
            ];
        });

        // Esta línea sirve para responder con el resumen.
        return response()->json(['data' => $data]);
    }

    /**
     * Ver el volumen por grupo muscular.
     *
     * Suma peso × repeticiones de las series completadas (sin calentamiento)
     * de los últimos 7 días (`range=weekly`, por defecto) o 30 días
     * (`range=monthly`).
     *
     * @response array{data: list<array{muscle_group: string, volume_kg: float}>}
     */
    // Esta línea sirve para declarar el endpoint que devuelve el volumen por grupo muscular.
    public function volume(VolumeQueryRequest $request): JsonResponse
    {
        // Esta línea sirve para elegir 30 días si el rango es mensual, o 7 si es semanal.
        $days = $request->validated('range', 'weekly') === 'monthly' ? 30 : 7;
        // Esta línea sirve para calcular la fecha desde la que se cuenta.
        $from = now()->subDays($days - 1)->toDateString();

        // Esta línea sirve para consultar las sesiones del período.
        $sessions = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para filtrar solo las completadas.
            ->where('completed', true)
            // Esta línea sirve para filtrar las sesiones desde esa fecha.
            ->whereDate('performed_at', '>=', $from)
            // Esta línea sirve para cargar ejercicios, series y el músculo principal de cada ejercicio.
            ->with('exercises.sets', 'exercises.exercise.primaryMuscle')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para calcular el volumen por músculo a partir de las sesiones.
        $volumeByMuscle = $sessions
            // Esta línea sirve para juntar todos los ejercicios de todas las sesiones.
            ->flatMap(fn (WorkoutSession $session) => $session->exercises)
            // Esta línea sirve para agruparlos por el nombre del músculo principal.
            ->groupBy(fn ($exercise) => $exercise->exercise->primaryMuscle->name)
            // Esta línea sirve para calcular el volumen de cada grupo.
            ->map(function ($exercises) {
                // Esta línea sirve para devolver el volumen del grupo.
                return $exercises
                    // Esta línea sirve para juntar todas las series de los ejercicios.
                    ->flatMap(fn ($exercise) => $exercise->sets)
                    // Esta línea sirve para quedarse solo con las series completadas que no son de calentamiento.
                    ->filter(fn ($set) => $set->completed && ! $set->is_warmup)
                    // Esta línea sirve para sumar peso por repeticiones de cada serie.
                    ->sum(fn ($set) => (float) $set->weight_kg * $set->reps);
            })
            // Esta línea sirve para redondear cada volumen a 2 decimales.
            ->map(fn (float $volume) => round($volume, 2))
            // Esta línea sirve para ordenar de mayor a menor volumen.
            ->sortDesc();

        // Esta línea sirve para responder con el volumen.
        return response()->json([
            // Esta línea sirve para convertir cada grupo en un objeto con músculo y volumen.
            'data' => $volumeByMuscle->map(fn (float $volume, string $muscle) => [
                // Esta línea sirve para incluir el nombre del grupo muscular.
                'muscle_group' => $muscle,
                // Esta línea sirve para incluir el volumen en kilos.
                'volume_kg' => $volume,
                // Esta línea sirve para reindexar la lista.
            ])->values(),
        ]);
    }

    /** Listar mis récords personales. */
    // Esta línea sirve para declarar el endpoint que lista los récords personales.
    public function personalRecords(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar los récords.
        $records = PersonalRecord::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para cargar el ejercicio de cada récord.
            ->with('exercise')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('achieved_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los récords.
        return response()->json([
            // Esta línea sirve para incluir los récords con su formato.
            'data' => PersonalRecordResource::collection($records),
        ]);
    }

    /**
     * Registrar un récord personal manual.
     *
     * Registro privado: no pasa por revisión ni cuenta para los rankings
     * (para eso está `POST /pr-submissions`). Si supera el mejor 1RM del
     * ejercicio responde 201 con `meta.is_new_best: true`; si no, 200 con el
     * récord vigente.
     */
    // Esta línea sirve para declarar el endpoint que registra un récord personal manual.
    public function storePersonalRecord(RegisterPersonalRecordRequest $request, RegisterManualPersonalRecordAction $action): JsonResponse
    {
        // Esta línea sirve para registrar el récord (devuelve null si no supera el mejor).
        $record = $action->execute(
            // Esta línea sirve para pasar el usuario autenticado.
            $request->user(),
            // Esta línea sirve para pasar el ejercicio.
            (int) $request->validated('exercise_id'),
            // Esta línea sirve para pasar el peso.
            (float) $request->validated('weight_kg'),
            // Esta línea sirve para pasar las repeticiones.
            (int) $request->validated('reps'),
        );

        // Esta línea sirve para guardar si el récord nuevo es el mejor.
        $isNewBest = $record !== null;

        // Esta línea sirve para buscar el récord vigente si el nuevo no lo superó.
        $record ??= PersonalRecord::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para filtrar por el ejercicio.
            ->where('exercise_id', $request->validated('exercise_id'))
            // Esta línea sirve para filtrar por el tipo de récord 1RM.
            ->where('record_type', '1rm')
            // Esta línea sirve para obtener el primero o responder 404.
            ->firstOrFail();

        // Esta línea sirve para responder con el récord.
        return response()->json([
            // Esta línea sirve para incluir el récord con su ejercicio convertido en arreglo.
            'data' => (new PersonalRecordResource($record->load('exercise')))->resolve(),
            // Esta línea sirve para incluir si es un nuevo mejor récord.
            'meta' => ['is_new_best' => $isNewBest],
            // Esta línea sirve para usar código 201 si es un nuevo mejor récord, o 200 si no.
        ], $isNewBest ? 201 : 200);
    }

    /**
     * Ver la evolución de una métrica.
     *
     * `metric=weight` (peso corporal), `volume` (volumen diario de los
     * últimos 90 días) o `1rm` (1RM estimado por sesión con la fórmula de
     * Epley; requiere `exercise_id`).
     *
     * @response array{data: list<array{date: string, value: float}>}
     */
    // Esta línea sirve para declarar el endpoint que devuelve la evolución de una métrica.
    public function progress(ProgressQueryRequest $request): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();
        // Esta línea sirve para leer la métrica pedida.
        $metric = $request->validated('metric');

        // Esta línea sirve para armar la serie según la métrica.
        $series = match ($metric) {
            // Esta línea sirve para usar el peso corporal registrado si la métrica es "weight".
            'weight' => BodyMeasurement::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar solo las medidas con peso.
                ->whereNotNull('weight_kg')
                // Esta línea sirve para ordenar por fecha de medición.
                ->orderBy('measured_at')
                // Esta línea sirve para ejecutar la consulta.
                ->get()
                // Esta línea sirve para convertir cada medida en un punto de la serie.
                ->map(fn (BodyMeasurement $m) => [
                    // Esta línea sirve para incluir la fecha.
                    'date' => $m->measured_at->toDateString(),
                    // Esta línea sirve para incluir el peso.
                    'value' => (float) $m->weight_kg,
                ]),
            // Esta línea sirve para usar el volumen diario si la métrica es "volume".
            'volume' => UserStatsDaily::query()
                // Esta línea sirve para filtrar por el usuario.
                ->where('user_id', $user->id)
                // Esta línea sirve para filtrar los últimos 90 días.
                ->whereDate('stat_date', '>=', now()->subDays(89)->toDateString())
                // Esta línea sirve para ordenar por fecha.
                ->orderBy('stat_date')
                // Esta línea sirve para ejecutar la consulta.
                ->get()
                // Esta línea sirve para convertir cada día en un punto de la serie.
                ->map(fn (UserStatsDaily $s) => [
                    // Esta línea sirve para incluir la fecha.
                    'date' => $s->stat_date->toDateString(),
                    // Esta línea sirve para incluir el volumen total del día.
                    'value' => (float) $s->total_volume_kg,
                ]),
            // Esta línea sirve para usar la serie del 1RM estimado del ejercicio si la métrica es "1rm".
            '1rm' => $this->estimated1RmSeries($user->id, (int) $request->validated('exercise_id')),
        };

        // Esta línea sirve para responder con la serie reindexada.
        return response()->json(['data' => $series->values()]);
    }

    /**
     * @return Collection<int, array{date: string, value: float}>
     *
     * Reconstruida a partir de las series históricas (fórmula de Epley) en
     * lugar de leer `personal_records`, porque esa tabla solo conserva el
     * mejor valor actual (updateOrCreate), no un historial por fecha.
     */
    // Esta línea sirve para declarar el método privado que arma la serie del 1RM estimado.
    private function estimated1RmSeries(int $userId, int $exerciseId): Collection
    {
        // Esta línea sirve para consultar las sesiones del usuario.
        $sessions = WorkoutSession::query()
            // Esta línea sirve para filtrar por el usuario.
            ->where('user_id', $userId)
            // Esta línea sirve para filtrar solo las completadas.
            ->where('completed', true)
            // Esta línea sirve para filtrar las que incluyen el ejercicio.
            ->whereHas('exercises', fn ($q) => $q->where('exercise_id', $exerciseId))
            // Esta línea sirve para cargar solo ese ejercicio y sus series.
            ->with(['exercises' => fn ($q) => $q->where('exercise_id', $exerciseId), 'exercises.sets'])
            // Esta línea sirve para ordenar por fecha.
            ->orderBy('performed_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para devolver la serie a partir de las sesiones.
        return $sessions
            // Esta línea sirve para calcular el mejor 1RM de cada sesión.
            ->map(function (WorkoutSession $session) {
                // Esta línea sirve para tomar los ejercicios de la sesión.
                $best = $session->exercises
                    // Esta línea sirve para juntar todas sus series.
                    ->flatMap(fn ($exercise) => $exercise->sets)
                    // Esta línea sirve para quedarse con las series completadas, sin calentamiento y con peso.
                    ->filter(fn ($set) => $set->completed && ! $set->is_warmup && (float) $set->weight_kg > 0)
                    // Esta línea sirve para calcular el 1RM estimado de cada serie con la fórmula de Epley.
                    ->map(fn ($set) => (float) $set->weight_kg * (1 + $set->reps / 30))
                    // Esta línea sirve para quedarse con el mayor.
                    ->max();

                // Esta línea sirve para devolver null si no hubo series válidas, o el punto de la serie.
                return $best === null ? null : [
                    // Esta línea sirve para incluir la fecha de la sesión.
                    'date' => $session->performed_at->toDateString(),
                    // Esta línea sirve para incluir el 1RM redondeado a 2 decimales.
                    'value' => round($best, 2),
                ];
            })
            // Esta línea sirve para quitar las sesiones sin valor (null).
            ->filter()
            // Esta línea sirve para reindexar la lista.
            ->values();
    }
}
