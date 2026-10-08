<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de la actualización de un pedido.
use App\Http\Requests\Admin\UpdateOrderTrackingRequest;
// Esta línea sirve para importar el resource que da formato a un pedido para el admin.
use App\Http\Resources\AdminOrderResource;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Admin · Pedidos" de Swagger.
#[Group('Admin · Pedidos', 'Pedidos de la tienda: listado, detalle con historial de cambios y seguimiento del envío.', weight: 32)]
// Esta línea sirve para declarar el controller de pedidos del panel admin.
class AdminOrderController extends Controller
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método privado que define las relaciones a cargar.
    private static function eager(): array
    {
        // Esta línea sirve para devolver las relaciones.
        return [
            // Esta línea sirve para cargar los ítems del pedido.
            'items',
            // Más reciente primero. orderByDesc('id') en vez de latest():
            // dos cambios seguidos pueden compartir el mismo created_at (la
            // columna solo guarda precisión de segundo), e "id" sí es una
            // secuencia monótona que nunca empata.
            // Esta línea sirve para cargar el historial de cambios con su autor, del más reciente al más antiguo.
            'activities' => fn ($query) => $query->with('causer')->orderByDesc('id'),
        ];
    }

    /**
     * Listar pedidos.
     *
     * Todos los pedidos, los más recientes primero; `status` filtra por
     * estado.
     *
     * El listado (AdminOrdersPage) nunca renderiza `history` — solo el
     * detalle lo usa. Antes index() eager-cargaba `activities.causer` igual
     * que show(), así que cada carga del listado disparaba 2 queries extra
     * y serializaba el historial completo de auditoría de CADA pedido para
     * un dato que la pantalla de lista descarta.
     */
    // Esta línea sirve para declarar el endpoint que lista los pedidos.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar los pedidos.
        $orders = Order::query()
            // Esta línea sirve para cargar sus ítems.
            ->with('items')
            // Esta línea sirve para filtrar por estado si se envió.
            ->when($request->query('status'), fn ($query, $status) => $query->where('status', $status))
            // Esta línea sirve para ordenar del más reciente al más antiguo.
            ->orderByDesc('created_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los pedidos.
        return response()->json(['data' => AdminOrderResource::collection($orders)]);
    }

    /**
     * Ver un pedido.
     *
     * Incluye `history`, el historial de cambios del pedido.
     */
    // Esta línea sirve para declarar el endpoint que muestra un pedido.
    public function show(Order $order): JsonResponse
    {
        // Esta línea sirve para responder con el pedido y su historial cargado.
        return response()->json(['data' => new AdminOrderResource($order->load(self::eager()))]);
    }

    /**
     * Actualizar el estado y el seguimiento de un pedido.
     *
     * Un solo PATCH cubre status + seguimiento + mensajes — el mismo botón
     * "Guardar cambios" del panel admin manda todo junto (ver
     * UpdateOrderTrackingRequest). El historial de qué cambió lo registra
     * solo Order::getActivitylogOptions(), no hace falta nada extra acá.
     */
    // Esta línea sirve para declarar el endpoint que actualiza un pedido.
    public function update(UpdateOrderTrackingRequest $request, Order $order): JsonResponse
    {
        // Esta línea sirve para actualizar el pedido con los datos validados.
        $order->update($request->validated());

        // Esta línea sirve para responder con el pedido y su historial cargado.
        return response()->json(['data' => new AdminOrderResource($order->load(self::eager()))]);
    }
}
