<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExerciseRequest;
use App\Http\Resources\AdminExerciseResource;
use App\Models\Exercise;
use App\Models\MuscleGroup;
use Illuminate\Http\JsonResponse;

class AdminExerciseController extends Controller
{
    /**
     * A diferencia de ExerciseController::index (solo activos, para el
     * selector del editor de rutinas), acá se listan todos — el admin
     * necesita ver los inactivos para poder reactivarlos.
     */
    public function index(): JsonResponse
    {
        $exercises = Exercise::query()->with('primaryMuscle')->orderBy('name')->get();

        return response()->json([
            'data' => AdminExerciseResource::collection($exercises),
            'meta' => [
                'muscle_groups' => MuscleGroup::query()->orderBy('name')->get(['id', 'name']),
            ],
        ]);
    }

    public function store(ExerciseRequest $request): JsonResponse
    {
        $exercise = Exercise::query()->create($request->validated() + ['is_active' => true]);

        return response()->json(['data' => new AdminExerciseResource($exercise->load('primaryMuscle'))], 201);
    }

    public function update(ExerciseRequest $request, Exercise $exercise): JsonResponse
    {
        $exercise->update($request->validated());

        return response()->json(['data' => new AdminExerciseResource($exercise->load('primaryMuscle'))]);
    }

    /**
     * No borra la fila: exercises.id está referenciado por
     * routine_exercises/workout_exercises ya generados, un hard delete
     * rompería esos historiales. is_active existe para esto — el ejercicio
     * deja de aparecer en el selector de rutinas pero el historial pasado
     * sigue íntegro.
     */
    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->update(['is_active' => false]);

        return response()->json(['data' => new AdminExerciseResource($exercise->load('primaryMuscle'))]);
    }
}
