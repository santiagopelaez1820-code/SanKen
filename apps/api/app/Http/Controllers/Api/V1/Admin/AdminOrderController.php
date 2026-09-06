<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderTrackingRequest;
use App\Http\Resources\AdminOrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * @return array<string, mixed>
     */
    private static function eager(): array
    {
        return [
            'items',
            // Más reciente primero. orderByDesc('id') en vez de latest():
            // dos cambios seguidos pueden compartir el mismo created_at (la
            // columna solo guarda precisión de segundo), e "id" sí es una
            // secuencia monótona que nunca empata.
            'activities' => fn ($query) => $query->with('causer')->orderByDesc('id'),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->with(self::eager())
            ->when($request->query('status'), fn ($query, $status) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => AdminOrderResource::collection($orders)]);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(['data' => new AdminOrderResource($order->load(self::eager()))]);
    }

    /**
     * Un solo PATCH cubre status + seguimiento + mensajes — el mismo botón
     * "Guardar cambios" del panel admin manda todo junto (ver
     * UpdateOrderTrackingRequest). El historial de qué cambió lo registra
     * solo Order::getActivitylogOptions(), no hace falta nada extra acá.
     */
    public function update(UpdateOrderTrackingRequest $request, Order $order): JsonResponse
    {
        $order->update($request->validated());

        return response()->json(['data' => new AdminOrderResource($order->load(self::eager()))]);
    }
}
