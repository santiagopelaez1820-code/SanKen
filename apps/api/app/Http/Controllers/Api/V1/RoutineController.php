<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Routine\Actions\DetermineNextRoutineDayAction;
use App\Application\Routine\Actions\GenerateRoutineAction;
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoutineResource;
use App\Models\Routine;
use App\Support\CacheKeys;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class RoutineController extends Controller
{
    public function active(Request $request, RoutineRepositoryInterface $routines, DetermineNextRoutineDayAction $nextDay): JsonResponse
    {
        $routine = $routines->findActiveForUser($request->user());

        if (! $routine) {
            return response()->json([
                'message' => 'Todavía no tienes una rutina activa. Completa el onboarding para generar una.',
            ], 404);
        }

        // next_day_id cambia con cada sesión completada, independiente de la
        // rutina; se calcula siempre fresco para no tener que invalidar el
        // cache de abajo en el path más caliente (fin de entrenamiento).
        $routine->loadMissing('days');

        $payload = Cache::remember(
            CacheKeys::activeRoutine($request->user()->id),
            now()->addHour(),
            fn () => (new RoutineResource($routine->load('days.exercises.exercise.primaryMuscle')))->resolve(),
        );

        return response()->json([
            'data' => $payload,
            'meta' => [
                'next_day_id' => $nextDay->execute($routine)?->id,
            ],
        ]);
    }

    public function show(Request $request, Routine $routine): JsonResponse
    {
        Gate::authorize('view', $routine);

        return response()->json([
            'data' => new RoutineResource($routine->load('days.exercises.exercise.primaryMuscle')),
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
            'data' => new RoutineResource($routine->load('days.exercises.exercise.primaryMuscle')),
        ], 201);
    }
}
