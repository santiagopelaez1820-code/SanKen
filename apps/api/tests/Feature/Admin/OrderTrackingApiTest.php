<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Fase 3 — seguimiento de pedidos y comunicación por WhatsApp. Cubre lo que
 * OrderApiTest/AdminOrderApiTest (creados en Fase 1/2) no tocan: campos
 * nuevos, el botón de WhatsApp, la separación admin/cliente de admin_notes,
 * y que el historial de auditoría (Spatie Activitylog) quede expuesto.
 */
class OrderTrackingApiTest extends TestCase
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

    private function checkoutPayload(array $items, array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Juan Pérez',
            'customer_email' => 'juan@example.com',
            'customer_phone' => '3000000000',
            'customer_whatsapp' => '3000000000',
            'department' => 'Antioquia',
            'city' => 'Medellín',
            'address' => 'Calle 10 # 20-30',
            'additional_info' => null,
            'items' => $items,
        ], $overrides);
    }

    public function test_customer_whatsapp_is_required_to_create_an_order(): void
    {
        $user = User::factory()->create();
        $product = \App\Models\Product::factory()->create();

        $payload = $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ], ['customer_whatsapp' => '']);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('customer_whatsapp');
    }

    public function test_customer_has_no_route_available_to_change_their_own_order_status(): void
    {
        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        // No existe PATCH /api/v1/orders/{order} — "Mis pedidos" es de solo
        // lectura para el cliente, cambiar el estado es exclusivo del admin.
        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/orders/{$order->id}", ['status' => 'delivered'])
            ->assertStatus(405);
    }

    public function test_non_admin_cannot_patch_the_admin_tracking_endpoint(): void
    {
        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/v1/admin/orders/{$order->id}", ['status' => 'confirming'])
            ->assertForbidden();

        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_admin_order_resource_exposes_a_whatsapp_url_to_the_customer(): void
    {
        config(['app.support_whatsapp_number' => null]);

        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $order = $this->makeOrder($user, ['customer_whatsapp' => '3001234567', 'status' => 'shipped']);

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        $response->assertOk();
        $url = $response->json('data.whatsapp_url');
        $this->assertNotNull($url);
        $this->assertStringStartsWith('https://wa.me/573001234567?text=', $url);
    }

    public function test_customer_order_resource_exposes_support_whatsapp_url_when_configured(): void
    {
        config(['app.support_whatsapp_number' => '3009999999']);

        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        $response->assertOk();
        $this->assertStringStartsWith('https://wa.me/573009999999?text=', $response->json('data.support_whatsapp_url'));
    }

    public function test_customer_order_resource_omits_support_whatsapp_url_when_not_configured(): void
    {
        config(['app.support_whatsapp_number' => null]);

        $user = User::factory()->create();
        $order = $this->makeOrder($user);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        $response->assertOk();
        $this->assertNull($response->json('data.support_whatsapp_url'));
    }

    public function test_customer_resource_never_exposes_admin_only_fields(): void
    {
        $user = User::factory()->create();
        $order = $this->makeOrder($user, ['admin_notes' => 'Nota interna']);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        $response->assertOk();
        $response->assertJsonMissingPath('data.admin_notes');
        $response->assertJsonMissingPath('data.whatsapp_url');
        $response->assertJsonMissingPath('data.history');
    }

    public function test_a_status_change_is_recorded_in_the_orders_history(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $order = $this->makeOrder($user, ['status' => 'pending']);

        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/orders/{$order->id}", [
            'status' => 'confirming',
        ])->assertOk();

        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        $response->assertOk();
        $history = $response->json('data.history');
        $this->assertNotEmpty($history);
        $this->assertSame($admin->id, $history[0]['causer']['id']);
        $this->assertSame('confirming', $history[0]['changes']['attributes']['status']);
    }

    public function test_updating_only_admin_notes_does_not_change_the_order_status(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $order = $this->makeOrder($user, ['status' => 'processing']);

        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/orders/{$order->id}", [
            'admin_notes' => 'Solo una nota, sin tocar el estado.',
        ])->assertOk();

        $this->assertSame('processing', $order->fresh()->status);
        $this->assertSame('Solo una nota, sin tocar el estado.', $order->fresh()->admin_notes);
    }
}
