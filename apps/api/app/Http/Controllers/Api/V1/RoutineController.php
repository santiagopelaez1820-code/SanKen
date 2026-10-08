<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que calcula si el entrenamiento de hoy está bloqueado.
use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
// Esta línea sirve para importar la acción que calcula el próximo día de la rutina.
use App\Application\Routine\Actions\DetermineNextRoutineDayAction;
// Esta línea sirve para importar la acción que genera una rutina.
use App\Application\Routine\Actions\GenerateRoutineAction;
// Esta línea sirve para importar el contrato del repositorio de rutinas.
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un ejercicio de la rutina.
use App\Http\Resources\RoutineExerciseResource;
// Esta línea sirve para importar el resource que da formato a una rutina.
use App\Http\Resources\RoutineResource;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo RoutineExercise (ejercicio dentro de un día de rutina).
use App\Models\RoutineExercise;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Cache para guardar datos en caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para agrupar este controller en la sección "Rutinas" de Swagger.
#[Group('Rutinas', 'Rutina activa del usuario, regeneración y cambio de ejercicios por su alternativa.', weight: 6)]
// Esta línea sirve para declarar el controller de rutinas.
class RoutineController extends Controller
{
    /**
     * Obtener la rutina activa.
     *
     * `meta.next_day_id` es el próximo día a entrenar y `meta.daily_lock`
     * indica si el turno de hoy ya se usó (sesión completada o saltada):
     * mientras `locked` sea `true` (hasta `unlocks_at`, 00:00 UTC) no se
     * puede iniciar ni saltar otra sesión de la rutina. Responde 404 si el
     * usuario todavía no tiene rutina.
     */
    // Esta línea sirve para declarar el endpoint que devuelve la rutina activa.
    public function active(
        // Esta línea sirve para recibir la petición.
        Request $request,
        // Esta línea sirve para recibir el repositorio de rutinas.
        RoutineRepositoryInterface $routines,
        // Esta línea sirve para recibir la acción que calcula el próximo día.
        DetermineNextRoutineDayAction $nextDay,
        // Esta línea sirve para recibir la acción que calcula el bloqueo diario.
        DetermineDailyLockStatusAction $dailyLock,
        // Esta línea sirve para indicar que el método devuelve una respuesta JSON.
    ): JsonResponse {
        // Esta línea sirve para buscar la rutina activa del usuario.
        $routine = $routines->findActiveForUser($request->user());

        // Esta línea sirve para revisar si el usuario no tiene rutina activa.
        if (! $routine) {
            // Esta línea sirve para responder con error 404.
            return response()->json([
                // Esta línea sirve para indicar que hay que completar el onboarding.
                'message' => 'Todavía no tienes una rutina activa. Completa el onboarding para generar una.',
                // Esta línea sirve para indicar el código HTTP 404.
            ], 404);
        }

        // next_day_id y daily_lock cambian con cada sesión completada,
        // independiente de la rutina; se calculan siempre frescos para no
        // tener que invalidar el cache de abajo en el path más caliente (fin
        // de entrenamiento).
        // Esta línea sirve para cargar los días de la rutina si no estaban cargados.
        $routine->loadMissing('days');
        // Esta línea sirve para calcular si el entrenamiento de hoy está bloqueado.
        $lock = $dailyLock->execute($routine);

        // Esta línea sirve para guardar en caché la rutina con su formato (o leerla si ya estaba).
        $payload = Cache::remember(
            // Esta línea sirve para usar la clave de caché de la rutina activa del usuario.
            CacheKeys::activeRoutine($request->user()->id),
            // Esta línea sirve para mantenerla en caché durante una hora.
            now()->addHour(),
            // Esta línea sirve para cargar días, ejercicios, músculos y alternativas y convertir la rutina en arreglo.
            fn () => (new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])))->resolve(),
        );

        // Esta línea sirve para responder con la rutina.
        return response()->json([
            // Esta línea sirve para incluir la rutina con su formato.
            'data' => $payload,
            // Esta línea sirve para incluir datos extra.
            'meta' => [
                // Esta línea sirve para incluir el id del próximo día a entrenar.
                'next_day_id' => $nextDay->execute($routine)?->id,
                // El frontend SOLO representa este estado (texto, contador
                // visual) -- la regla real la impone el backend rechazando
                // StartWorkoutSessionAction/SkipWorkoutSessionAction mientras
                // locked=true, sin importar qué mande el cliente acá.
                // Esta línea sirve para incluir el estado del bloqueo diario.
                'daily_lock' => [
                    // Esta línea sirve para indicar si está bloqueado.
                    'locked' => $lock->locked,
                    // Esta línea sirve para indicar cuándo se desbloquea, en formato ISO 8601.
                    'unlocks_at' => $lock->unlocksAt?->toIso8601String(),
                    // Esta línea sirve para indicar el motivo del bloqueo.
                    'reason' => $lock->reason,
                ],
            ],
        ]);
    }

    /**
     * Ver una rutina.
     *
     * Días y ejercicios (con sus alternativas) de una rutina propia.
     */
    // Esta línea sirve para declarar el endpoint que muestra una rutina.
    public function show(Request $request, Routine $routine): JsonResponse
    {
        // Esta línea sirve para verificar que la rutina es del usuario.
        Gate::authorize('view', $routine);

        // Esta línea sirve para responder con la rutina.
        return response()->json([
            // Esta línea sirve para incluir la rutina con días, ejercicios, músculos y alternativas.
            'data' => new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])),
        ]);
    }

    /**
     * Regenerar la rutina.
     *
     * Genera una rutina nueva a partir de las respuestas actuales del
     * onboarding (tiene que estar completo) y desactiva la anterior. Si la
     * rutina activa la asignó un entrenador o un Super Admin, no se reemplaza:
     * se devuelve esa misma.
     */
    // Esta línea sirve para declarar el endpoint que regenera la rutina.
    public function generate(Request $request): JsonResponse
    {
        // Esta línea sirve para obtener el usuario con sus respuestas del onboarding.
        $user = $request->user()->loadMissing('onboardingResponse');

        // Esta línea sirve para revisar si el onboarding no está completo.
        if (! $user->onboardingResponse?->completed) {
            // Esta línea sirve para lanzar un error de validación (422).
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que hay que completar el onboarding primero.
                'onboarding' => ['Debes completar el onboarding antes de generar una rutina.'],
            ]);
        }

        // Esta línea sirve para generar la rutina en el momento (sin pasar por la cola).
        $routine = GenerateRoutineAction::dispatchSync($user);

        // Esta línea sirve para responder con la rutina nueva.
        return response()->json([
            // Esta línea sirve para incluir la rutina con días, ejercicios, músculos y alternativas.
            'data' => new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])),
            // Esta línea sirve para indicar el código HTTP 201 (creado).
        ], 201);
    }

    /**
     * Cambiar un ejercicio de la rutina por su alternativa.
     *
     * Sustituye el ejercicio de esta fila de la rutina por su alternativa
     * A/B (exercise_alternatives, ver RoutineTemplateSeeder). No genera una
     * rutina nueva ni toca workout_exercises/workout_sets — las sesiones ya
     * iniciadas copiaron su propio exercise_id al arrancar (ver
     * StartWorkoutSessionAction) y no se ven afectadas por este cambio.
     *
     * Como exercise_alternatives se siembra en ambas direcciones, llamar
     * este mismo endpoint de nuevo vuelve al ejercicio original — no hace
     * falta un endpoint ni un estado aparte para "volver al anterior".
     */
    // Esta línea sirve para declarar el endpoint que cambia un ejercicio por su alternativa.
    public function swapExercise(Request $request, Routine $routine, RoutineExercise $routineExercise): JsonResponse
    {
        // Esta línea sirve para verificar que la rutina es del usuario.
        Gate::authorize('view', $routine);

        // Esta línea sirve para revisar si el ejercicio no pertenece a esta rutina.
        if ($routineExercise->routineDay->routine_id !== $routine->id) {
            // Esta línea sirve para responder 404.
            abort(404);
        }

        // Esta línea sirve para cargar el ejercicio y sus alternativas.
        $routineExercise->load('exercise.alternatives');
        // Esta línea sirve para tomar la primera alternativa.
        $alternative = $routineExercise->exercise->alternatives->first();

        // Esta línea sirve para revisar si no hay alternativa.
        if (! $alternative) {
            // Esta línea sirve para lanzar un error de validación (422).
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar que el ejercicio no tiene alternativa.
                'exercise' => ['Este ejercicio no tiene una alternativa configurada.'],
            ]);
        }

        // Esta línea sirve para cambiar el ejercicio por la alternativa.
        $routineExercise->update(['exercise_id' => $alternative->id]);
        // Esta línea sirve para cargar el ejercicio nuevo con su músculo y alternativas.
        $routineExercise->load(['exercise.primaryMuscle', 'exercise.alternatives.primaryMuscle']);

        // Esta línea sirve para borrar la rutina activa del caché para que se vea el cambio.
        Cache::forget(CacheKeys::activeRoutine($request->user()->id));

        // Esta línea sirve para responder con el ejercicio actualizado.
        return response()->json([
            // Esta línea sirve para incluir el ejercicio con su formato.
            'data' => new RoutineExerciseResource($routineExercise),
        ]);
    }
}
