<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workout\UpdateSetRequest;
use App\Http\Resources\WorkoutSetResource;
use App\Models\WorkoutSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class WorkoutSetController extends Controller
{
    public function update(UpdateSetRequest $request, WorkoutSet $workoutSet): JsonResponse
    {
        Gate::authorize('update', $workoutSet);

        $workoutSet->update($request->validated());

        return response()->json(['data' => new WorkoutSetResource($workoutSet)]);
    }
}
