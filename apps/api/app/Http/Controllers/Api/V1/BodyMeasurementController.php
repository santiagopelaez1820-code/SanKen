<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Progress\Actions\RecordBodyMeasurementAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Progress\StoreBodyMeasurementRequest;
use App\Http\Resources\BodyMeasurementResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BodyMeasurementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $measurements = $request->user()->bodyMeasurements()
            ->orderByDesc('measured_at')
            ->paginate(15);

        return response()->json([
            'data' => BodyMeasurementResource::collection($measurements->items()),
            'meta' => [
                'current_page' => $measurements->currentPage(),
                'last_page' => $measurements->lastPage(),
                'total' => $measurements->total(),
            ],
        ]);
    }

    public function store(StoreBodyMeasurementRequest $request, RecordBodyMeasurementAction $action): JsonResponse
    {
        $measurement = $action->execute($request->user(), $request->validated());

        return response()->json([
            'data' => new BodyMeasurementResource($measurement),
        ], 201);
    }
}
