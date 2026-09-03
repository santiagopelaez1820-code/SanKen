<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    private function checkoutPayload(array $items, array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Juan Pérez',
            'customer_email' => 'juan@example.com',
            'customer_phone' => '3000000000',
            'department' => 'Antioquia',
            'city' => 'Medellín',
            'address' => 'Calle 10 # 20-30',
            'additional_info' => null,
            'items' => $items,
        ], $overrides);
    }

    public function test_guest_cannot_create_an_order(): void
    {
        $this->postJson('/api/v1/orders', [])->assertUnauthorized();
    }

    /**
     * Caso de seguridad clave: aunque el cliente mande un precio manipulado
     * dentro de items, el backend jamás lo lee — solo product_id/quantity
     * viajan en el payload, así que el total sale exclusivamente de lo que
     * hay en la base de datos.
     */
    public function test_it_recalculates_prices_from_the_database_ignoring_any_client_input(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 50000]);

        $payload = $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 2, 'unit_price' => 1, 'price' => 1],
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.subtotal', '100000.00');
        $response->assertJsonPath('data.total', '100000.00');
        $response->assertJsonPath('data.items.0.unit_price', '50000.00');
        $this->assertDatabaseHas('order_items', ['product_id' => $product->id, 'unit_price' => 50000, 'quantity' => 2]);
    }

    public function test_it_computes_the_total_correctly_with_multiple_items(): void
    {
        $user = User::factory()->create();
        $productA = Product::factory()->create(['price' => 30000]);
        $productB = Product::factory()->create(['price' => 45000]);

        $payload = $this->checkoutPayload([
            ['product_id' => $productA->id, 'quantity' => 2],
            ['product_id' => $productB->id, 'quantity' => 1],
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload);

        $response->assertCreated();
        // 30000*2 + 45000*1 = 105000
        $response->assertJsonPath('data.subtotal', '105000.00');
        $response->assertJsonPath('data.total', '105000.00');
        $response->assertJsonCount(2, 'data.items');
    }

    public function test_new_orders_start_as_pending(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]));

        $response->assertJsonPath('data.status', 'pending');
    }

    public function test_it_rejects_an_inactive_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->inactive()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]))->assertStatus(422);
    }

    public function test_it_rejects_a_nonexistent_product(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => 999999, 'quantity' => 1],
        ]))->assertStatus(422);
    }

    public function test_it_validates_quantity_bounds(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 0],
        ]))->assertStatus(422);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 51],
        ]))->assertStatus(422);
    }

    /**
     * order_items conserva el nombre/precio del momento del pedido aunque
     * el producto cambie después — así el historial nunca se reescribe.
     */
    public function test_order_items_keep_the_historical_name_and_price_after_the_product_changes(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['name' => 'Creatina Original', 'price' => 60000]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]))->assertCreated();

        $product->update(['name' => 'Creatina Renombrada', 'price' => 90000]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'product_name' => 'Creatina Original',
            'unit_price' => 60000,
        ]);
    }
}
