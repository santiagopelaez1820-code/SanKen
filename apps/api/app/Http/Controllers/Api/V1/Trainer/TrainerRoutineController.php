<?php

namespace App\Http\Controllers\Api\V1\Trainer;

use App\Application\Trainer\Actions\CreateManualRoutineAction;
use App\Application\Trainer\Actions\UpdateManualRoutineAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\StoreManualRoutineRequest;
use App\Http\Requests\Trainer\UpdateManualRoutineRequest;
use App\Http\Resources\RoutineResource;
use App\Models\Routine;
use App\Models\TrainerClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TrainerRoutineController extends Controller
{
    public function store(StoreManualRoutineRequest $request, TrainerClient $trainerClient, CreateManualRoutineAction $action): JsonResponse
    {
        Gate::authorize('view', $trainerClient);

        $routine = $action->execute($request->user(), $trainerClient, $request->validated());

        return response()->json(['data' => new RoutineResource($routine)], 201);
    }

    public function show(Request $request, Routine $routine): JsonResponse
    {
        Gate::authorize('manage', $routine);

        return response()->json([
            'data' => new RoutineResource($routine->load('days.exercises.exercise.primaryMuscle')),
        ]);
    }

    public function update(UpdateManualRoutineRequest $request, Routine $routine, UpdateManualRoutineAction $action): JsonResponse
    {
        Gate::authorize('manage', $routine);

        $routine = $action->execute($routine, $request->validated());

        return response()->json(['data' => new RoutineResource($routine)]);
    }
}
