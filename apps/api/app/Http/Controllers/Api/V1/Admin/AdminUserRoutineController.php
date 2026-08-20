<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Application\Admin\Actions\AssignPersonalRoutineAction;
use App\Application\Admin\Actions\RevertToGeneralRoutineAction;
use App\Application\Admin\Actions\UpdatePersonalRoutineAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignRoutineRequest;
use App\Http\Resources\RoutineResource;
use App\Models\Routine;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Rutina personalizada por usuario — no confundir con las "rutinas
 * generales" de AdminRoutineTemplateController. Protegido solo por el
 * middleware role:super_admin del grupo de rutas (mismo criterio que
 * AdminExerciseController: no hay caso de "actuar sobre uno mismo" aquí).
 */
class AdminUserRoutineController extends Controller
{
    public function show(User $user): JsonResponse
    {
        $routine = $user->routines()->where('is_active', true)
            ->with('days.exercises.exercise.primaryMuscle')
            ->first();

        return response()->json(['data' => $routine ? new RoutineResource($routine) : null]);
    }

    public function store(AssignRoutineRequest $request, User $user): JsonResponse
    {
        $routine = (new AssignPersonalRoutineAction)->execute($request->user(), $user, $request->validated());

        return response()->json(['data' => new RoutineResource($routine)], 201);
    }

    public function update(AssignRoutineRequest $request, Routine $routine): JsonResponse
    {
        $updated = (new UpdatePersonalRoutineAction)->execute($routine, $request->validated());

        return response()->json(['data' => new RoutineResource($updated)]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $routine = (new RevertToGeneralRoutineAction)->execute($user);

        return response()->json(['data' => new RoutineResource($routine)]);
    }
}
