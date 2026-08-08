<?php

namespace App\Http\Controllers\Api\V1\Trainer;

use App\Application\Trainer\Actions\AddClientAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\AddClientRequest;
use App\Http\Requests\Trainer\UpdateClientStatusRequest;
use App\Http\Resources\RoutineResource;
use App\Http\Resources\TrainerClientResource;
use App\Models\TrainerClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TrainerClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $clients = $request->user()->trainerClients()
            ->with('client')
            ->latest()
            ->get();

        return response()->json([
            'data' => TrainerClientResource::collection($clients),
        ]);
    }

    public function store(AddClientRequest $request, AddClientAction $action): JsonResponse
    {
        $trainerClient = $action->execute($request->user(), $request->validated('email'));

        return response()->json([
            'data' => new TrainerClientResource($trainerClient->load('client')),
        ], 201);
    }

    public function show(Request $request, TrainerClient $trainerClient): JsonResponse
    {
        Gate::authorize('view', $trainerClient);

        $trainerClient->load('client');

        $activeRoutine = $trainerClient->client->routines()
            ->where('is_active', true)
            ->with('days.exercises.exercise.primaryMuscle')
            ->first();

        return response()->json([
            'data' => new TrainerClientResource($trainerClient),
            'meta' => [
                'active_routine' => $activeRoutine ? new RoutineResource($activeRoutine) : null,
            ],
        ]);
    }

    public function update(UpdateClientStatusRequest $request, TrainerClient $trainerClient): JsonResponse
    {
        Gate::authorize('update', $trainerClient);

        $status = $request->validated('status');

        $trainerClient->update([
            'status' => $status,
            'ended_at' => $status === 'ended' ? now() : $trainerClient->ended_at,
        ]);

        return response()->json([
            'data' => new TrainerClientResource($trainerClient->load('client')),
        ]);
    }
}
