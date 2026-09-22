<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Routine\Actions\DetermineDailyLockStatusAction;
use App\Application\Routine\Actions\DetermineNextRoutineDayAction;
use App\Application\Routine\Actions\GenerateRoutineAction;
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoutineExerciseResource;
use App\Http\Resources\RoutineResource;
use App\Models\Routine;
use App\Models\RoutineExercise;
use App\Support\CacheKeys;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class RoutineController extends Controller
{
    public function active(
        Request $request,
        RoutineRepositoryInterface $routines,
        DetermineNextRoutineDayAction $nextDay,
        DetermineDailyLockStatusAction $dailyLock,
    ): JsonResponse {
        $routine = $routines->findActiveForUser($request->user());

        if (! $routine) {
            return response()->json([
                'message' => 'Todavía no tienes una rutina activa. Completa el onboarding para generar una.',
            ], 404);
        }

        // next_day_id y daily_lock cambian con cada sesión completada,
        // independiente de la rutina; se calculan siempre frescos para no
        // tener que invalidar el cache de abajo en el path más caliente (fin
        // de entrenamiento).
        $routine->loadMissing('days');
        $lock = $dailyLock->execute($routine);

        $payload = Cache::remember(
            CacheKeys::activeRoutine($request->user()->id),
            now()->addHour(),
            fn () => (new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])))->resolve(),
        );

        return response()->json([
            'data' => $payload,
            'meta' => [
                'next_day_id' => $nextDay->execute($routine)?->id,
                // El frontend SOLO representa este estado (texto, contador
                // visual) -- la regla real la impone el backend rechazando
                // StartWorkoutSessionAction/SkipWorkoutSessionAction mientras
                // locked=true, sin importar qué mande el cliente acá.
                'daily_lock' => [
                    'locked' => $lock->locked,
                    'unlocks_at' => $lock->unlocksAt?->toIso8601String(),
                    'reason' => $lock->reason,
                ],
            ],
        ]);
    }

    public function show(Request $request, Routine $routine): JsonResponse
    {
        Gate::authorize('view', $routine);

        return response()->json([
            'data' => new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])),
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('onboardingResponse');

        if (! $user->onboardingResponse?->completed) {
            throw ValidationException::withMessages([
                'onboarding' => ['Debes completar el onboarding antes de generar una rutina.'],
            ]);
        }

        $routine = GenerateRoutineAction::dispatchSync($user);

        return response()->json([
            'data' => new RoutineResource($routine->load(['days.exercises.exercise.primaryMuscle', 'days.exercises.exercise.alternatives.primaryMuscle'])),
        ], 201);
    }

    /**
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
    public function swapExercise(Request $request, Routine $routine, RoutineExercise $routineExercise): JsonResponse
    {
        Gate::authorize('view', $routine);

        if ($routineExercise->routineDay->routine_id !== $routine->id) {
            abort(404);
        }

        $routineExercise->load('exercise.alternatives');
        $alternative = $routineExercise->exercise->alternatives->first();

        if (! $alternative) {
            throw ValidationException::withMessages([
                'exercise' => ['Este ejercicio no tiene una alternativa configurada.'],
            ]);
        }

        $routineExercise->update(['exercise_id' => $alternative->id]);
        $routineExercise->load(['exercise.primaryMuscle', 'exercise.alternatives.primaryMuscle']);

        Cache::forget(CacheKeys::activeRoutine($request->user()->id));

        return response()->json([
            'data' => new RoutineExerciseResource($routineExercise),
        ]);
    }
}
