<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que agrega un ejercicio a la sesión.
use App\Application\Workout\Actions\AddExerciseToSessionAction;
// Esta línea sirve para importar la acción que cancela una sesión.
use App\Application\Workout\Actions\CancelWorkoutSessionAction;
// Esta línea sirve para importar la acción que completa una sesión.
use App\Application\Workout\Actions\CompleteWorkoutSessionAction;
// Esta línea sirve para importar la acción que detecta récords personales.
use App\Application\Workout\Actions\DetectPersonalRecordAction;
// Esta línea sirve para importar la acción que registra una serie.
use App\Application\Workout\Actions\LogSetAction;
// Esta línea sirve para importar la acción que salta el entrenamiento del día.
use App\Application\Workout\Actions\SkipWorkoutSessionAction;
// Esta línea sirve para importar la acción que inicia una sesión.
use App\Application\Workout\Actions\StartWorkoutSessionAction;
// Esta línea sirve para importar la acción que guarda el feedback de la sesión.
use App\Application\Workout\Actions\SubmitSessionFeedbackAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación para agregar un ejercicio a la sesión.
use App\Http\Requests\Workout\AddSessionExerciseRequest;
// Esta línea sirve para importar la validación para completar una sesión.
use App\Http\Requests\Workout\CompleteWorkoutSessionRequest;
// Esta línea sirve para importar la validación del registro de una serie.
use App\Http\Requests\Workout\LogSetRequest;
// Esta línea sirve para importar la validación para saltar el entrenamiento.
use App\Http\Requests\Workout\SkipWorkoutSessionRequest;
// Esta línea sirve para importar la validación para iniciar una sesión.
use App\Http\Requests\Workout\StartWorkoutSessionRequest;
// Esta línea sirve para importar la validación del feedback.
use App\Http\Requests\Workout\SubmitFeedbackRequest;
// Esta línea sirve para importar la validación de la edición de un ejercicio de la sesión.
use App\Http\Requests\Workout\UpdateSessionExerciseRequest;
// Esta línea sirve para importar la validación de la edición de una sesión.
use App\Http\Requests\Workout\UpdateWorkoutSessionRequest;
// Esta línea sirve para importar el resource que da formato a un ejercicio de la sesión.
use App\Http\Resources\WorkoutExerciseResource;
// Esta línea sirve para importar el resource que da formato a una sesión.
use App\Http\Resources\WorkoutSessionResource;
// Esta línea sirve para importar el resource que da formato a una serie.
use App\Http\Resources\WorkoutSetResource;
// Esta línea sirve para importar el modelo RoutineDay (día de rutina).
use App\Models\RoutineDay;
// Esta línea sirve para importar el modelo WorkoutExercise (ejercicio dentro de una sesión).
use App\Models\WorkoutExercise;
// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento).
use App\Models\WorkoutSession;
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
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Entrenamientos" de Swagger.
#[Group('Entrenamientos', 'Sesiones de entrenamiento: inicio (o salto) del día, ejercicios, series, cierre, feedback y correcciones.', weight: 7)]
// Esta línea sirve para declarar el controller de las sesiones de entrenamiento.
class WorkoutSessionController extends Controller
{
    // Esta línea sirve para definir las relaciones que se cargan siempre junto con la sesión.
    private const EAGER = [
        // Esta línea sirve para incluir el ejercicio y su músculo principal.
        'exercises.exercise.primaryMuscle',
        // Esta línea sirve para incluir las alternativas del ejercicio con su músculo.
        'exercises.exercise.alternatives.primaryMuscle',
        // Esta línea sirve para incluir las series de cada ejercicio.
        'exercises.sets',
        // Esta línea sirve para incluir el día de rutina.
        'routineDay',
    ];

    /**
     * Listar mi historial de entrenamientos.
     *
     * Paginado de a 15, del más reciente al más antiguo.
     */
    // Esta línea sirve para documentar en Swagger el parámetro "page" (número de página).
    #[QueryParameter('page', 'Número de página.', type: 'int', default: 1)]
    // Esta línea sirve para declarar el endpoint que lista el historial de entrenamientos.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar las sesiones del usuario.
        $sessions = $request->user()->workoutSessions()
            // Esta línea sirve para cargar las relaciones de siempre.
            ->with(self::EAGER)
            // Esta línea sirve para ordenar de la más reciente a la más antigua.
            ->orderByDesc('performed_at')
            // Esta línea sirve para paginar de a 15.
            ->paginate(15);

        // Esta línea sirve para responder con las sesiones.
        return response()->json([
            // Esta línea sirve para incluir las sesiones de esta página con su formato.
            'data' => WorkoutSessionResource::collection($sessions->items()),
            // Esta línea sirve para incluir los datos de paginación.
            'meta' => $this->paginationMeta($sessions),
        ]);
    }

    /**
     * Iniciar un entrenamiento.
     *
     * Con `routine_day_id` arranca ese día de la rutina (copia sus
     * ejercicios); sin él crea un entrenamiento libre. El precheck (sueño,
     * energía y dolor muscular, de 1 a 5) es opcional. Si ese mismo día de
     * rutina se canceló hoy, retoma esa sesión en vez de crear otra. Responde
     * 422 mientras el bloqueo diario esté activo.
     */
    // Esta línea sirve para declarar el endpoint que inicia un entrenamiento.
    public function store(StartWorkoutSessionRequest $request, StartWorkoutSessionAction $action): JsonResponse
    {
        // Esta línea sirve para empezar sin día de rutina (entrenamiento libre).
        $routineDay = null;

        // Esta línea sirve para revisar si se envió un día de rutina.
        if ($routineDayId = $request->validated('routine_day_id')) {
            // Esta línea sirve para buscar el día con sus ejercicios o responder 404.
            $routineDay = RoutineDay::query()->with('exercises')->findOrFail($routineDayId);

            // Esta línea sirve para verificar que la rutina de ese día es del usuario.
            Gate::authorize('view', $routineDay->routine);
        }

        // Esta línea sirve para iniciar la sesión con el precheck enviado.
        $session = $action->execute($request->user(), $routineDay, $request->validated());

        // Esta línea sirve para responder con la sesión creada.
        return response()->json([
            // Esta línea sirve para incluir la sesión con sus relaciones.
            'data' => new WorkoutSessionResource($session->load(self::EAGER)),
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /**
     * Saltar el entrenamiento de hoy.
     *
     * Consume el turno del día (activa el bloqueo diario) sin registrar
     * ejercicios ni afectar la sobrecarga progresiva.
     */
    // Esta línea sirve para declarar el endpoint que salta el entrenamiento de hoy.
    public function skip(SkipWorkoutSessionRequest $request, SkipWorkoutSessionAction $action): JsonResponse
    {
        // Esta línea sirve para empezar sin día de rutina.
        $routineDay = null;

        // Esta línea sirve para revisar si se envió un día de rutina.
        if ($routineDayId = $request->validated('routine_day_id')) {
            // Esta línea sirve para buscar el día o responder 404.
            $routineDay = RoutineDay::query()->findOrFail($routineDayId);

            // Esta línea sirve para verificar que la rutina de ese día es del usuario.
            Gate::authorize('view', $routineDay->routine);
        }

        // Esta línea sirve para registrar la sesión saltada.
        $session = $action->execute($request->user(), $routineDay);

        // Esta línea sirve para responder con la sesión saltada.
        return response()->json([
            // Esta línea sirve para incluir la sesión con sus relaciones.
            'data' => new WorkoutSessionResource($session->load(self::EAGER)),
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /** Ver un entrenamiento. */
    // Esta línea sirve para declarar el endpoint que muestra un entrenamiento.
    public function show(Request $request, WorkoutSession $workoutSession): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para responder con la sesión.
        return response()->json([
            // Esta línea sirve para incluir la sesión con sus relaciones.
            'data' => new WorkoutSessionResource($workoutSession->load(self::EAGER)),
        ]);
    }

    /** Actualizar la duración o las notas de un entrenamiento. */
    // Esta línea sirve para declarar el endpoint que actualiza la duración o las notas.
    public function update(UpdateWorkoutSessionRequest $request, WorkoutSession $workoutSession): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para guardar los cambios validados.
        $workoutSession->update($request->validated());

        // Esta línea sirve para responder con la sesión actualizada.
        return response()->json([
            // Esta línea sirve para incluir la sesión con sus relaciones.
            'data' => new WorkoutSessionResource($workoutSession->load(self::EAGER)),
        ]);
    }

    /** Agregar un ejercicio al entrenamiento. */
    // Esta línea sirve para declarar el endpoint que agrega un ejercicio al entrenamiento.
    public function addExercise(AddSessionExerciseRequest $request, WorkoutSession $workoutSession, AddExerciseToSessionAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para agregar el ejercicio a la sesión.
        $exercise = $action->execute($workoutSession, $request->validated('exercise_id'));

        // Esta línea sirve para responder con el ejercicio agregado y código 201.
        return response()->json(['data' => new WorkoutExerciseResource($exercise)], 201);
    }

    /** Marcar si se completaron todas las series de un ejercicio. */
    // Esta línea sirve para declarar el endpoint que marca si se completaron las series de un ejercicio.
    public function updateExercise(UpdateSessionExerciseRequest $request, WorkoutSession $workoutSession, WorkoutExercise $workoutExercise): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);
        // Esta línea sirve para verificar que el ejercicio pertenece a la sesión.
        $this->authorizeExerciseBelongsToSession($workoutSession, $workoutExercise);

        // Esta línea sirve para guardar los cambios validados.
        $workoutExercise->update($request->validated());

        // Esta línea sirve para responder con el ejercicio, su músculo y sus series.
        return response()->json(['data' => new WorkoutExerciseResource($workoutExercise->load('exercise.primaryMuscle', 'sets'))]);
    }

    /**
     * Cambiar un ejercicio del entrenamiento por su alternativa.
     *
     * Sustituye el ejercicio de esta fila de la SESION en curso por su
     * alternativa A/B (no toca routine_exercises — la rutina en si queda
     * intacta, ver seccion 32 del pedido; la proxima vez que el usuario
     * repita este dia, vuelve a ver el ejercicio original de la plantilla).
     *
     * Solo se permite si todavia no se registro ninguna serie: una vez que
     * hay sets logueados, el exercise_id de esta fila ya es parte del
     * historial/sobrecarga progresiva (ver DetectPersonalRecordAction) y
     * cambiarlo retroactivamente lo corromperia.
     */
    // Esta línea sirve para declarar el endpoint que cambia un ejercicio de la sesión por su alternativa.
    public function swapExercise(Request $request, WorkoutSession $workoutSession, WorkoutExercise $workoutExercise): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);
        // Esta línea sirve para verificar que el ejercicio pertenece a la sesión.
        $this->authorizeExerciseBelongsToSession($workoutSession, $workoutExercise);

        // Esta línea sirve para revisar si ya hay series registradas para ese ejercicio.
        if ($workoutExercise->sets()->exists()) {
            // Esta línea sirve para lanzar un error de validación (422).
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que ya no se puede cambiar el ejercicio.
                'exercise' => ['Ya registraste series para este ejercicio en esta sesión — no se puede cambiar.'],
            ]);
        }

        // Esta línea sirve para cargar el ejercicio y sus alternativas.
        $workoutExercise->load('exercise.alternatives');
        // Esta línea sirve para tomar la primera alternativa.
        $alternative = $workoutExercise->exercise->alternatives->first();

        // Esta línea sirve para revisar si no hay alternativa.
        if (! $alternative) {
            // Esta línea sirve para lanzar un error de validación (422).
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el ejercicio no tiene alternativa.
                'exercise' => ['Este ejercicio no tiene una alternativa configurada.'],
            ]);
        }

        // Esta línea sirve para cambiar el ejercicio por la alternativa.
        $workoutExercise->update(['exercise_id' => $alternative->id]);
        // Esta línea sirve para cargar el ejercicio nuevo con su músculo, alternativas y series.
        $workoutExercise->load(['exercise.primaryMuscle', 'exercise.alternatives.primaryMuscle', 'sets']);

        // Esta línea sirve para responder con el ejercicio actualizado.
        return response()->json([
            // Esta línea sirve para incluir el ejercicio con su formato.
            'data' => new WorkoutExerciseResource($workoutExercise),
        ]);
    }

    /**
     * Registrar una serie.
     *
     * Devuelve la serie con `is_personal_record: true` si batió un récord
     * personal del usuario en ese ejercicio.
     */
    // Esta línea sirve para declarar el endpoint que registra una serie.
    public function logSet(
        // Esta línea sirve para recibir los datos validados de la serie.
        LogSetRequest $request,
        // Esta línea sirve para recibir la sesión.
        WorkoutSession $workoutSession,
        // Esta línea sirve para recibir el ejercicio de la sesión.
        WorkoutExercise $workoutExercise,
        // Esta línea sirve para recibir la acción que registra la serie.
        LogSetAction $action,
        // Esta línea sirve para recibir la acción que detecta récords personales.
        DetectPersonalRecordAction $prAction,
        // Esta línea sirve para indicar que el método devuelve una respuesta JSON.
    ): JsonResponse {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);
        // Esta línea sirve para verificar que el ejercicio pertenece a la sesión.
        $this->authorizeExerciseBelongsToSession($workoutSession, $workoutExercise);

        // Esta línea sirve para registrar la serie.
        $set = $action->execute($workoutExercise, $request->validated());
        // Esta línea sirve para revisar si la serie batió un récord personal.
        $record = $prAction->execute($request->user(), $set, $workoutExercise->exercise_id);

        // Esta línea sirve para responder con la serie.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para copiar los datos de la serie con su formato.
                ...(new WorkoutSetResource($set))->resolve(),
                // Esta línea sirve para indicar si batió un récord personal.
                'is_personal_record' => $record !== null,
            ],
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /**
     * Terminar el entrenamiento.
     *
     * Marca la sesión como completada, recalcula estadísticas y otorga XP,
     * logros y progreso de retos (resumen en `meta.gamification`). Una sesión
     * cancelada no se puede completar.
     */
    // Esta línea sirve para declarar el endpoint que termina el entrenamiento.
    public function complete(CompleteWorkoutSessionRequest $request, WorkoutSession $workoutSession, CompleteWorkoutSessionAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para completar la sesión y obtener la sesión y el resumen de gamificación.
        ['session' => $session, 'gamification' => $gamification] = $action->execute(
            // Esta línea sirve para pasar la sesión, la duración y las notas.
            $workoutSession, $request->validated('duration_minutes'), $request->validated('notes'),
        );

        // Esta línea sirve para responder con la sesión completada.
        return response()->json([
            // Esta línea sirve para incluir la sesión con su formato.
            'data' => new WorkoutSessionResource($session),
            // Esta línea sirve para incluir el resumen de XP, logros y retos.
            'meta' => ['gamification' => $gamification],
        ]);
    }

    /**
     * Salir de un entrenamiento sin terminarlo.
     *
     * La sesión no cuenta como entrenada y las series registradas se
     * conservan; iniciar hoy el mismo día de rutina la retoma. Una sesión ya
     * completada no se puede cancelar.
     */
    // Esta línea sirve para declarar el endpoint que sale de un entrenamiento sin terminarlo.
    public function cancel(Request $request, WorkoutSession $workoutSession, CancelWorkoutSessionAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para cancelar la sesión.
        $session = $action->execute($workoutSession);

        // Esta línea sirve para responder con la sesión cancelada.
        return response()->json([
            // Esta línea sirve para incluir la sesión con su formato.
            'data' => new WorkoutSessionResource($session),
        ]);
    }

    /**
     * Responder si el entrenamiento se completó como estaba planeado.
     *
     * Ajusta los pesos y repeticiones sugeridos (sobrecarga progresiva) para
     * la próxima vez que toque ese día de la rutina. En un entrenamiento libre
     * solo se guarda la respuesta.
     */
    // Esta línea sirve para declarar el endpoint que guarda si el entrenamiento se hizo como estaba planeado.
    public function feedback(SubmitFeedbackRequest $request, WorkoutSession $workoutSession, SubmitSessionFeedbackAction $action): JsonResponse
    {
        // Esta línea sirve para verificar que la sesión es del usuario.
        $this->authorizeOwner($workoutSession);

        // Esta línea sirve para guardar la respuesta y ajustar la sobrecarga progresiva.
        $session = $action->execute($workoutSession, $request->validated('completed_as_planned'));

        // Esta línea sirve para responder con la sesión.
        return response()->json([
            // Esta línea sirve para incluir la sesión con su formato.
            'data' => new WorkoutSessionResource($session),
        ]);
    }

    // Esta línea sirve para declarar el método privado que verifica que la sesión sea del usuario.
    private function authorizeOwner(WorkoutSession $session): void
    {
        // Esta línea sirve para verificar el permiso de ver la sesión.
        Gate::authorize('view', $session);
    }

    // Esta línea sirve para declarar el método privado que verifica que el ejercicio pertenezca a la sesión.
    private function authorizeExerciseBelongsToSession(WorkoutSession $session, WorkoutExercise $exercise): void
    {
        // Esta línea sirve para revisar si el ejercicio es de otra sesión.
        if ($exercise->workout_session_id !== $session->id) {
            // Esta línea sirve para responder 404.
            abort(404);
        }
    }
}
