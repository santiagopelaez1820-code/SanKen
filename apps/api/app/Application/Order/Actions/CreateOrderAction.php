<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de pedidos.

namespace App\Application\Order\Actions;

// Esta línea sirve para importar el catálogo de estados de un pedido.
use App\Domain\Order\OrderStatusCatalog;
// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el modelo Product (producto).
use App\Models\Product;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

/**
 * Crea un pedido recalculando el precio de cada producto desde la base de
 * datos — el precio (y el nombre) que pudiera mandar el cliente en el
 * checkout se ignora por completo, así nadie puede manipular un total desde
 * el payload. `items` en $data ya viene validado por StoreOrderRequest como
 * [{product_id, quantity}], sin ningún campo de precio.
 *
 * @phpstan-type OrderItemInput array{product_id:int,quantity:int}
 */
// Esta línea sirve para declarar la acción que crea un pedido de la tienda.
class CreateOrderAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir la acción que notifica el pedido nuevo.
        private readonly NotifyOrderCreatedAction $notifyOrderCreated,
    ) {}

    /**
     * @param  array{customer_name:string,customer_email:string,customer_phone:string,customer_whatsapp:string,department:string,city:string,address:string,additional_info?:string|null,items:array<int,array{product_id:int,quantity:int}>}  $data
     */
    // Esta línea sirve para declarar el método que recibe al usuario y los datos del pedido.
    public function execute(User $user, array $data): Order
    {
        // Esta línea sirve para crear el pedido dentro de una transacción.
        $order = DB::transaction(function () use ($user, $data) {
            // Esta línea sirve para armar los ítems y calcular el subtotal con precios de la base de datos.
            [$itemsData, $subtotal] = $this->buildItems($data['items']);

            // Esta línea sirve para crear el pedido con los siguientes datos.
            $order = Order::query()->create([
                // Esta línea sirve para guardar el id del usuario que compra.
                'user_id' => $user->id,
                // Esta línea sirve para dejar el pedido en estado pendiente.
                'status' => OrderStatusCatalog::PENDING,
                // Esta línea sirve para guardar el nombre del cliente.
                'customer_name' => $data['customer_name'],
                // Esta línea sirve para guardar el correo del cliente.
                'customer_email' => $data['customer_email'],
                // Esta línea sirve para guardar el teléfono del cliente.
                'customer_phone' => $data['customer_phone'],
                // Esta línea sirve para guardar el WhatsApp del cliente.
                'customer_whatsapp' => $data['customer_whatsapp'],
                // Esta línea sirve para guardar el departamento de envío.
                'department' => $data['department'],
                // Esta línea sirve para guardar la ciudad de envío.
                'city' => $data['city'],
                // Esta línea sirve para guardar la dirección de envío.
                'address' => $data['address'],
                // Esta línea sirve para guardar la información adicional, o null si no hay.
                'additional_info' => $data['additional_info'] ?? null,
                // Esta línea sirve para guardar el subtotal calculado.
                'subtotal' => $subtotal,
                // Sin cálculo de envío todavía (pedido explícito del negocio) — queda
                // "pendiente/no definido" hasta que exista una regla real de costos.
                // Esta línea sirve para dejar el costo de envío sin definir.
                'shipping_cost' => null,
                // Esta línea sirve para guardar el total (igual al subtotal por ahora).
                'total' => $subtotal,
            ]);

            // Esta línea sirve para crear todos los ítems del pedido.
            $order->items()->createMany($itemsData);

            // Esta línea sirve para devolver el pedido con sus ítems cargados.
            return $order->load('items');
        });

        // Fuera de la transacción a propósito: si NotifyOrderCreatedAction
        // fallara acá adentro, revertiría el pedido que ya se dio por
        // creado. El pedido debe quedar persistido pase lo que pase con la
        // notificación (ver NotifyOrderCreatedAction, que además envuelve
        // todo en try/catch por su cuenta).
        // Esta línea sirve para notificar que se creó el pedido (fuera de la transacción).
        $this->notifyOrderCreated->execute($order);

        // Esta línea sirve para devolver el pedido creado.
        return $order;
    }

    /**
     * @param  array<int, array{product_id:int,quantity:int}>  $items
     * @return array{0: array<int, array<string, mixed>>, 1: float}
     */
    // Esta línea sirve para declarar el método privado que arma los ítems y el subtotal.
    private function buildItems(array $items): array
    {
        // Esta línea sirve para iniciar la lista de ítems.
        $itemsData = [];
        // Esta línea sirve para iniciar el subtotal en cero.
        $subtotal = 0.0;

        // Esta línea sirve para recorrer cada ítem recibido.
        foreach ($items as $item) {
            // Esta línea sirve para buscar el producto en la base de datos.
            $product = Product::query()->find($item['product_id']);

            // Esta línea sirve para revisar si el producto no existe o está inactivo.
            if (! $product || ! $product->active) {
                // Esta línea sirve para lanzar un error de validación.
                throw ValidationException::withMessages([
                    // Esta línea sirve para indicar que un producto ya no está disponible.
                    'items' => ['Uno de los productos seleccionados ya no está disponible.'],
                ]);
            }

            // Esta línea sirve para tomar el precio unitario real desde la base de datos.
            $unitPrice = (float) $product->price;
            // Esta línea sirve para calcular el subtotal de la línea redondeado a 2 decimales.
            $lineSubtotal = round($unitPrice * $item['quantity'], 2);
            // Esta línea sirve para sumarlo al subtotal del pedido.
            $subtotal += $lineSubtotal;

            // Esta línea sirve para agregar el ítem a la lista.
            $itemsData[] = [
                // Esta línea sirve para guardar el id del producto.
                'product_id' => $product->id,
                // Esta línea sirve para guardar el nombre del producto en ese momento.
                'product_name' => $product->name,
                // Esta línea sirve para guardar la cantidad.
                'quantity' => $item['quantity'],
                // Esta línea sirve para guardar el precio unitario.
                'unit_price' => $unitPrice,
                // Esta línea sirve para guardar el subtotal de la línea.
                'subtotal' => $lineSubtotal,
            ];
        }

        // Esta línea sirve para devolver los ítems y el subtotal redondeado.
        return [$itemsData, round($subtotal, 2)];
    }
}
