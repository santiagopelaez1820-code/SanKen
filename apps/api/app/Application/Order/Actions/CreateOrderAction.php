<?php

namespace App\Application\Order\Actions;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
class CreateOrderAction
{
    public function __construct(
        private readonly NotifyOrderCreatedAction $notifyOrderCreated,
    ) {}

    /**
     * @param array{customer_name:string,customer_email:string,customer_phone:string,department:string,city:string,address:string,additional_info?:string|null,items:array<int,array{product_id:int,quantity:int}>} $data
     */
    public function execute(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            [$itemsData, $subtotal] = $this->buildItems($data['items']);

            $order = Order::query()->create([
                'user_id' => $user->id,
                'status' => 'pending',
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],
                'department' => $data['department'],
                'city' => $data['city'],
                'address' => $data['address'],
                'additional_info' => $data['additional_info'] ?? null,
                'subtotal' => $subtotal,
                // Sin cálculo de envío todavía (pedido explícito del negocio) — queda
                // "pendiente/no definido" hasta que exista una regla real de costos.
                'shipping_cost' => null,
                'total' => $subtotal,
            ]);

            $order->items()->createMany($itemsData);

            $order = $order->load('items');

            $this->notifyOrderCreated->execute($order);

            return $order;
        });
    }

    /**
     * @param array<int, array{product_id:int,quantity:int}> $items
     * @return array{0: array<int, array<string, mixed>>, 1: float}
     */
    private function buildItems(array $items): array
    {
        $itemsData = [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            $product = Product::query()->find($item['product_id']);

            if (! $product || ! $product->active) {
                throw ValidationException::withMessages([
                    'items' => ['Uno de los productos seleccionados ya no está disponible.'],
                ]);
            }

            $unitPrice = (float) $product->price;
            $lineSubtotal = round($unitPrice * $item['quantity'], 2);
            $subtotal += $lineSubtotal;

            $itemsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'subtotal' => $lineSubtotal,
            ];
        }

        return [$itemsData, round($subtotal, 2)];
    }
}
