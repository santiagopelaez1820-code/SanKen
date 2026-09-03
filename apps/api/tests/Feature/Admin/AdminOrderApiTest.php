<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderApiTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrder(array $overrides = []): Order
    {
        return Order::query()->create(array_merge([
            'user_id' => User::factory()->create()->id,
            'status' => 'pending',
            'customer_name' => 'Juan Pérez',
            'customer_email' => 'juan@example.com',
            'customer_phone' => '3000000000',
            'department' => 'Antioquia',
            'city' => 'Medellín',
            'address' => 'Calle 10 # 20-30',
            'subtotal' => 50000,
            'shipping_cost' => null,
            'total' => 50000,
        ], $overrides));
    }

    public function test_non_admin_cannot_manage_orders(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/orders')->assertForbidden();
    }

    public function test_admin_can_list_orders_filtered_by_status(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->makeOrder(['status' => 'pending']);
        $this->makeOrder(['status' => 'delivered']);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/orders?status=delivered');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.status', 'delivered');
    }

    public function test_admin_can_view_order_detail_with_items(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $order = $this->makeOrder();
        $order->items()->create([
            'product_id' => null,
            'product_name' => 'Creatina',
            'quantity' => 1,
            'unit_price' => 50000,
            'subtotal' => 50000,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        $response->assertOk();
        $response->assertJsonPath('data.customer_name', 'Juan Pérez');
        $response->assertJsonCount(1, 'data.items');
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $order = $this->makeOrder(['status' => 'pending']);

        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/orders/{$order->id}/status", ['status' => 'confirmed']);

        $response->assertOk();
        $response->assertJsonPath('data.status', 'confirmed');
        $this->assertSame('confirmed', $order->fresh()->status);
    }

    public function test_invalid_status_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $order = $this->makeOrder();

        $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/v1/admin/orders/{$order->id}/status", ['status' => 'not_a_real_status'])
            ->assertStatus(422);
    }
}
