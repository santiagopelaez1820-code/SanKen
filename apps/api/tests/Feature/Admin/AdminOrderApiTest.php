<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Order.
use App\Models\Order;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminOrderApiTest.
class AdminOrderApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea un pedido.
    private function makeOrder(array $overrides = []): Order
    {
        // Esta línea sirve para crear el pedido mezclando los datos por defecto con los recibidos.
        return Order::query()->create(array_merge([
            // Esta línea sirve para asignar User::factory()->create()->id al campo "user_id".
            'user_id' => User::factory()->create()->id,
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

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar pedidos.
    public function test_non_admin_cannot_manage_orders(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/orders como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/orders')->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede filtrar pedidos por estado.
    public function test_admin_can_list_orders_filtered_by_status(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido pendiente.
        $this->makeOrder(['status' => 'pending']);
        // Esta línea sirve para crear un pedido entregado.
        $this->makeOrder(['status' => 'delivered']);

        // Esta línea sirve para hacer GET a /api/v1/admin/orders?status=delivered autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/orders?status=delivered');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.status" sea 'delivered'.
        $response->assertJsonPath('data.0.status', 'delivered');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve el detalle del pedido con sus productos.
    public function test_admin_can_view_order_detail_with_items(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido.
        $order = $this->makeOrder();
        // Esta línea sirve para agregarle un producto.
        $order->items()->create([
            // Esta línea sirve para asignar null al campo "product_id".
            'product_id' => null,
            // Esta línea sirve para asignar 'Creatina' al campo "product_name".
            'product_name' => 'Creatina',
            // Esta línea sirve para asignar 1 al campo "quantity".
            'quantity' => 1,
            // Esta línea sirve para asignar 50000 al campo "unit_price".
            'unit_price' => 50000,
            // Esta línea sirve para asignar 50000 al campo "subtotal".
            'subtotal' => 50000,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/admin/orders/{$order->id} autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.customer_name" sea 'Juan Pérez'.
        $response->assertJsonPath('data.customer_name', 'Juan Pérez');
        // Esta línea sirve para exigir que "data.items" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.items');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede cambiar el estado del pedido.
    public function test_admin_can_update_order_status(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido pendiente.
        $order = $this->makeOrder(['status' => 'pending']);

        // Esta línea sirve para preparar la petición autenticada como admin.
        $response = $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/orders/{$order->id} con los datos enviados.
            ->patchJson("/api/v1/admin/orders/{$order->id}", ['status' => 'confirming']);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.status" sea 'confirming'.
        $response->assertJsonPath('data.status', 'confirming');
        // Esta línea sirve para exigir que en la base de datos quede "confirming".
        $this->assertSame('confirming', $order->fresh()->status);
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza un estado inválido.
    public function test_invalid_status_is_rejected(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido.
        $order = $this->makeOrder();

        // Esta línea sirve para preparar la petición autenticada como admin.
        $this->actingAs($admin, 'sanctum')
            // Esta línea sirve para hacer PATCH a /api/v1/admin/orders/{$order->id} con los datos enviados.
            ->patchJson("/api/v1/admin/orders/{$order->id}", ['status' => 'not_a_real_status'])
            // Esta línea sirve para exigir que la respuesta sea 422.
            ->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede guardar guía, transportadora y mensaje.
    public function test_admin_can_update_tracking_number_carrier_and_customer_message(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido en proceso.
        $order = $this->makeOrder(['status' => 'processing']);

        // Esta línea sirve para hacer PATCH a /api/v1/admin/orders/{$order->id} autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/orders/{$order->id}", [
            // Esta línea sirve para asignar 'shipped' al campo "status".
            'status' => 'shipped',
            // Esta línea sirve para asignar 'ABC123456' al campo "tracking_number".
            'tracking_number' => 'ABC123456',
            // Esta línea sirve para asignar 'Coordinadora' al campo "carrier".
            'carrier' => 'Coordinadora',
            // Esta línea sirve para asignar 'Tu pedido va en camino.' al campo "customer_message".
            'customer_message' => 'Tu pedido va en camino.',
            // Esta línea sirve para asignar 'Cliente pidió entrega en portería.' al campo "admin_notes".
            'admin_notes' => 'Cliente pidió entrega en portería.',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.tracking_number" sea 'ABC123456'.
        $response->assertJsonPath('data.tracking_number', 'ABC123456');
        // Esta línea sirve para exigir que "data.carrier" sea 'Coordinadora'.
        $response->assertJsonPath('data.carrier', 'Coordinadora');
        // Esta línea sirve para exigir que "data.customer_message" sea 'Tu pedido va en camino.'.
        $response->assertJsonPath('data.customer_message', 'Tu pedido va en camino.');
        // Esta línea sirve para exigir que "data.admin_notes" sea 'Cliente pidió entrega en portería.'.
        $response->assertJsonPath('data.admin_notes', 'Cliente pidió entrega en portería.');
        // Esta línea sirve para exigir que en la base de datos quede la guía.
        $this->assertSame('ABC123456', $order->fresh()->tracking_number);
    }

    // Esta línea sirve para declarar el test que comprueba que las notas internas y el enlace de WhatsApp nunca llegan al cliente.
    public function test_admin_notes_and_whatsapp_url_are_never_exposed_to_the_customer_resource(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un pedido del propio admin con una nota interna.
        $order = $this->makeOrder([
            // Esta línea sirve para asignar $admin->id al campo "user_id".
            'user_id' => $admin->id,
            // Esta línea sirve para asignar 'Nota interna sensible' al campo "admin_notes".
            'admin_notes' => 'Nota interna sensible',
        ]);

        // Esta línea sirve para hacer GET al pedido desde la vista del cliente.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/orders/'.$order->id);

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que la respuesta no incluya "data.admin_notes".
        $response->assertJsonMissingPath('data.admin_notes');
        // Esta línea sirve para exigir que la respuesta no incluya "data.whatsapp_url".
        $response->assertJsonMissingPath('data.whatsapp_url');
    }
}
