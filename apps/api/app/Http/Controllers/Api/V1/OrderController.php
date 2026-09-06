<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Order\Actions\CreateOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrderController extends Controller
{
    /**
     * "Mis pedidos" — solo los del usuario autenticado, nunca los de otros
     * (a diferencia de AdminOrderController::index, que ve todos).
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => OrderResource::collection($orders)]);
    }

    public function show(Order $order): JsonResponse
    {
        Gate::authorize('view', $order);

        return response()->json(['data' => new OrderResource($order->load('items'))]);
    }

    public function store(StoreOrderRequest $request, CreateOrderAction $action): JsonResponse
    {
        $order = $action->execute($request->user(), $request->validated());

        return response()->json(['data' => new OrderResource($order)], 201);
    }
}
