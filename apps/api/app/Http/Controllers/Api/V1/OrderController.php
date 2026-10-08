<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar la acción que crea un pedido.
use App\Application\Order\Actions\CreateOrderAction;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la creación de un pedido.
use App\Http\Requests\StoreOrderRequest;
// Esta línea sirve para importar el resource que da formato a un pedido.
use App\Http\Resources\OrderResource;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la fachada Gate para verificar permisos.
use Illuminate\Support\Facades\Gate;

// Esta línea sirve para agrupar este controller en la sección "Tienda" de Swagger.
#[Group('Tienda', weight: 19)]
// Esta línea sirve para declarar el controller de los pedidos del usuario.
class OrderController extends Controller
{
    /**
     * Listar mis pedidos.
     *
     * "Mis pedidos" — solo los del usuario autenticado, nunca los de otros
     * (a diferencia de AdminOrderController::index, que ve todos).
     */
    // Esta línea sirve para declarar el endpoint que lista los pedidos del usuario.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar los pedidos.
        $orders = Order::query()
            // Esta línea sirve para filtrar solo los del usuario autenticado.
            ->where('user_id', $request->user()->id)
            // Esta línea sirve para cargar los productos de cada pedido.
            ->with('items')
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('created_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los pedidos con su formato.
        return response()->json(['data' => OrderResource::collection($orders)]);
    }

    /** Ver uno de mis pedidos. */
    // Esta línea sirve para declarar el endpoint que muestra un pedido.
    public function show(Order $order): JsonResponse
    {
        // Esta línea sirve para verificar que el pedido es del usuario.
        Gate::authorize('view', $order);

        // Esta línea sirve para responder con el pedido y sus productos.
        return response()->json(['data' => new OrderResource($order->load('items'))]);
    }

    /**
     * Crear un pedido.
     *
     * Los precios se recalculan en el servidor desde la base de datos;
     * cualquier precio que mande el cliente se ignora.
     */
    // Esta línea sirve para declarar el endpoint que crea un pedido.
    public function store(StoreOrderRequest $request, CreateOrderAction $action): JsonResponse
    {
        // Esta línea sirve para crear el pedido con los datos validados.
        $order = $action->execute($request->user(), $request->validated());

        // Esta línea sirve para responder con el pedido creado y código 201.
        return response()->json(['data' => new OrderResource($order)], 201);
    }
}
