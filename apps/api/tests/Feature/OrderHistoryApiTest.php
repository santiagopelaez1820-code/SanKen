<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderHistoryApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrder(User $user, array $overrides = []): Order
    {
        return Order::query()->create(array_merge([
            'user_id' => $user->id,
            'status' => 'pending',
            'customer_name' => 'Juan Pérez',
            'customer_email' => 'juan@example.com',
            'customer_phone' => '3000000000',
            'customer_whatsapp' => '3000000000',
            'department' => 'Antioquia',
            'city' => 'Medellín',
            'address' => 'Calle 10 # 20-30',
            'subtotal' => 50000,
            'shipping_cost' => null,
            'total' => 50000,
        ], $overrides));
    }

    public function test_guest_cannot_list_or_view_orders(): void
    {
        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        $this->getJson('/api/v1/orders')->assertUnauthorized();
        $this->getJson("/api/v1/orders/{$order->id}")->assertUnauthorized();
    }

    public function test_user_only_sees_their_own_orders_in_the_list(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->makeOrder($user);
        $this->makeOrder($user);
        $this->makeOrder($otherUser);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/orders');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    public function test_orders_are_sorted_most_recent_first(): void
    {
        $user = User::factory()->create();
        $older = $this->makeOrder($user);
        // created_at no está en $fillable (a propósito, no es mass-assignable) — se
        // asigna directo al atributo para simular un pedido más viejo en el test.
        $older->created_at = now()->subDays(2);
        $older->save();
        $newer = $this->makeOrder($user);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/orders');

        $response->assertJsonPath('data.0.id', $newer->id);
        $response->assertJsonPath('data.1.id', $older->id);
    }

    public function test_user_can_view_their_own_order_detail_with_items(): void
    {
        $user = User::factory()->create();
        $order = $this->makeOrder($user);
        $order->items()->create([
            'product_id' => null,
            'product_name' => 'Creatina',
            'quantity' => 1,
            'unit_price' => 50000,
            'subtotal' => 50000,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        $response->assertOk();
        $response->assertJsonPath('data.id', $order->id);
        $response->assertJsonCount(1, 'data.items');
    }

    public function test_a_user_cannot_view_another_users_order(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $order = $this->makeOrder($otherUser);

        $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}")->assertForbidden();
    }

    public function test_super_admin_can_view_any_order_through_this_endpoint_too(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        $this->actingAs($admin, 'sanctum')->getJson("/api/v1/orders/{$order->id}")->assertOk();
    }
}
