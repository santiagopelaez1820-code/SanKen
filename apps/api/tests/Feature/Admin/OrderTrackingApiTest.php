<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Order.
use App\Models\Order;
// Esta línea sirve para importar el modelo User.
use App\Models\Product;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use App\Models\User;
// Esta línea sirve para importar la clase base de los tests.
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Fase 3 — seguimiento de pedidos y comunicación por WhatsApp. Cubre lo que
 * OrderApiTest/AdminOrderApiTest (creados en Fase 1/2) no tocan: campos
 * nuevos, el botón de WhatsApp, la separación admin/cliente de admin_notes,
 * y que el historial de auditoría (Spatie Activitylog) quede expuesto.
 */
// Esta línea sirve para declarar la clase de tests OrderTrackingApiTest.
class OrderTrackingApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un pedido de un usuario.
    private function makeOrder(User $user, array $overrides = []): Order
    {
        // Esta línea sirve para crear el pedido mezclando los datos por defecto con los recibidos.
        return Order::query()->create(array_merge([
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar 'pending' al campo "status".
            'status' => 'pending',
            // Esta línea sirve para asignar 'Juan Pérez' al campo "customer_name".
            'customer_name' => 'Juan Pérez',
            // Esta línea sirve para asignar 'juan@example.com' al campo "customer_email".
            'customer_email' => 'juan@example.com',
            // Esta línea sirve para asignar '3000000000' al campo "customer_phone".
            'customer_phone' => '3000000000',
            // Esta línea sirve para asignar '3000000000' al campo "customer_whatsapp".
            'customer_whatsapp' => '3000000000',
            // Esta línea sirve para asignar 'Antioquia' al campo "department".
            'department' => 'Antioquia',
            // Esta línea sirve para asignar 'Medellín' al campo "city".
            'city' => 'Medellín',
            // Esta línea sirve para asignar 'Calle 10 # 20-30' al campo "address".
            'address' => 'Calle 10 # 20-30',
            // Esta línea sirve para asignar 50000 al campo "subtotal".
            'subtotal' => 50000,
            // Esta línea sirve para asignar null al campo "shipping_cost".
            'shipping_cost' => null,
            // Esta línea sirve para asignar 50000 al campo "total".
            'total' => 50000,
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides));
    }

    // Esta línea sirve para declarar el método auxiliar que arma los datos del checkout.
    private function checkoutPayload(array $items, array $overrides = []): array
    {
        // Esta línea sirve para devolver los datos por defecto mezclados con los recibidos.
        return array_merge([
            // Esta línea sirve para asignar 'Juan Pérez' al campo "customer_name".
            'customer_name' => 'Juan Pérez',
            // Esta línea sirve para asignar 'juan@example.com' al campo "customer_email".
            'customer_email' => 'juan@example.com',
            // Esta línea sirve para asignar '3000000000' al campo "customer_phone".
            'customer_phone' => '3000000000',
            // Esta línea sirve para asignar '3000000000' al campo "customer_whatsapp".
            'customer_whatsapp' => '3000000000',
            // Esta línea sirve para asignar 'Antioquia' al campo "department".
            'department' => 'Antioquia',
            // Esta línea sirve para asignar 'Medellín' al campo "city".
            'city' => 'Medellín',
            // Esta línea sirve para asignar 'Calle 10 # 20-30' al campo "address".
            'address' => 'Calle 10 # 20-30',
            // Esta línea sirve para asignar null al campo "additional_info".
            'additional_info' => null,
            // Esta línea sirve para asignar $items al campo "items".
            'items' => $items,
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides);
    }

    // Esta línea sirve para declarar el test que comprueba que el WhatsApp es obligatorio para crear un pedido.
    public function test_customer_whatsapp_is_required_to_create_an_order(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();

        // Esta línea sirve para armar los datos del checkout.
        $payload = $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
            // Esta línea sirve para enviar el WhatsApp vacío.
        ], ['customer_whatsapp' => '']);

        // Esta línea sirve para hacer POST del pedido como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload)
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422)
            // Esta línea sirve para exigir errores de validación en 'customer_whatsapp'.
            ->assertJsonValidationErrors('customer_whatsapp');
    }

    // Esta línea sirve para declarar el test que comprueba que el cliente no tiene ninguna ruta para cambiar el estado de su pedido.
    public function test_customer_has_no_route_available_to_change_their_own_order_status(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // No existe PATCH /api/v1/orders/{order} — "Mis pedidos" es de solo
        // lectura para el cliente, cambiar el estado es exclusivo del admin.
        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/orders/{$order->id} con los datos enviados.
            ->patchJson("/api/v1/orders/{$order->id}", ['status' => 'delivered'])
            // Esta línea sirve para exigir que la respuesta sea 405.
            ->assertStatus(405);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede usar el endpoint de seguimiento del admin.
    public function test_non_admin_cannot_patch_the_admin_tracking_endpoint(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/orders/{$order->id} con los datos enviados.
            ->patchJson("/api/v1/admin/orders/{$order->id}", ['status' => 'confirming'])
            // Esta línea sirve para exigir que la respuesta sea 403 (prohibido).
            ->assertForbidden();

        // Esta línea sirve para exigir que en la base de datos "status" sea 'pending'.
        $this->assertSame('pending', $order->fresh()->status);
    }

    // Esta línea sirve para declarar el test que comprueba que la vista del admin trae el enlace de WhatsApp hacia el cliente.
    public function test_admin_order_resource_exposes_a_whatsapp_url_to_the_customer(): void
    {
        // Esta línea sirve para configurar "app.support_whatsapp_number" con el valor null para este test.
        config(['app.support_whatsapp_number' => null]);

        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido enviado con WhatsApp del cliente.
        $order = $this->makeOrder($user, ['customer_whatsapp' => '3001234567', 'status' => 'shipped']);

        // Esta línea sirve para hacer GET a /api/v1/admin/orders/{$order->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener el enlace de WhatsApp.
        $url = $response->json('data.whatsapp_url');
        // Esta línea sirve para exigir que exista.
        $this->assertNotNull($url);
        // Esta línea sirve para exigir que apunte al WhatsApp del cliente con el prefijo de Colombia.
        $this->assertStringStartsWith('https://wa.me/573001234567?text=', $url);
    }

    // Esta línea sirve para declarar el test que comprueba que la vista del cliente trae el WhatsApp de soporte cuando está configurado.
    public function test_customer_order_resource_exposes_support_whatsapp_url_when_configured(): void
    {
        // Esta línea sirve para configurar "app.support_whatsapp_number" con el valor '3009999999' para este test.
        config(['app.support_whatsapp_number' => '3009999999']);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // Esta línea sirve para hacer GET a /api/v1/orders/{$order->id} autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que el enlace de soporte apunte al número configurado.
        $this->assertStringStartsWith('https://wa.me/573009999999?text=', $response->json('data.support_whatsapp_url'));
    }

    // Esta línea sirve para declarar el test que comprueba que la vista del cliente no trae el WhatsApp de soporte si no está configurado.
    public function test_customer_order_resource_omits_support_whatsapp_url_when_not_configured(): void
    {
        // Esta línea sirve para configurar "app.support_whatsapp_number" con el valor null para este test.
        config(['app.support_whatsapp_number' => null]);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // Esta línea sirve para hacer GET a /api/v1/orders/{$order->id} autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.support_whatsapp_url" sea null.
        $this->assertNull($response->json('data.support_whatsapp_url'));
    }

    // Esta línea sirve para declarar el test que comprueba que la vista del cliente nunca muestra campos solo del admin.
    public function test_customer_resource_never_exposes_admin_only_fields(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido con una nota interna.
        $order = $this->makeOrder($user, ['admin_notes' => 'Nota interna']);

        // Esta línea sirve para hacer GET a /api/v1/orders/{$order->id} autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta no incluya "data.admin_notes".
        $response->assertJsonMissingPath('data.admin_notes');
        // Esta línea sirve para exigir que la respuesta no incluya "data.whatsapp_url".
        $response->assertJsonMissingPath('data.whatsapp_url');
        // Esta línea sirve para exigir que la respuesta no incluya "data.history".
        $response->assertJsonMissingPath('data.history');
    }

    // Esta línea sirve para declarar el test que comprueba que un cambio de estado queda en el historial del pedido.
    public function test_a_status_change_is_recorded_in_the_orders_history(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido pendiente.
        $order = $this->makeOrder($user, ['status' => 'pending']);

        // Esta línea sirve para hacer la petición a /api/v1/admin/orders/{$order->id} como admin con estos datos.
        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/orders/{$order->id}", [
            // Esta línea sirve para asignar 'confirming' al campo "status".
            'status' => 'confirming',
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 200 (OK).
        ])->assertOk();

        // Esta línea sirve para hacer GET a /api/v1/admin/orders/{$order->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para obtener el historial del pedido.
        $history = $response->json('data.history');
        // Esta línea sirve para exigir que el historial no esté vacío.
        $this->assertNotEmpty($history);
        // Esta línea sirve para exigir que el cambio lo haya hecho el admin.
        $this->assertSame($admin->id, $history[0]['causer']['id']);
        // Esta línea sirve para exigir que el estado nuevo registrado sea "confirming".
        $this->assertSame('confirming', $history[0]['changes']['attributes']['status']);
    }

    // Esta línea sirve para declarar el test que comprueba que guardar solo notas no cambia el estado.
    public function test_updating_only_admin_notes_does_not_change_the_order_status(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido en proceso.
        $order = $this->makeOrder($user, ['status' => 'processing']);

        // Esta línea sirve para hacer la petición a /api/v1/admin/orders/{$order->id} como admin con estos datos.
        $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/orders/{$order->id}", [
            // Esta línea sirve para asignar 'Solo una nota, sin tocar el estado.' al campo "admin_notes".
            'admin_notes' => 'Solo una nota, sin tocar el estado.',
            // Esta línea sirve para cerrar los datos y exigir que la respuesta sea 200 (OK).
        ])->assertOk();

        // Esta línea sirve para exigir que en la base de datos "status" sea 'processing'.
        $this->assertSame('processing', $order->fresh()->status);
        // Esta línea sirve para exigir que se haya guardado la nota.
        $this->assertSame('Solo una nota, sin tocar el estado.', $order->fresh()->admin_notes);
    }
}
