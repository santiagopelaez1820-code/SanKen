<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Order\Actions\CreateOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, CreateOrderAction $action): JsonResponse
    {
        $order = $action->execute($request->user(), $request->validated());

        return response()->json(['data' => new OrderResource($order)], 201);
    }
}
