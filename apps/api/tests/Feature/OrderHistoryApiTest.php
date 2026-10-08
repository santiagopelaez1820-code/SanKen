<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo Order.
use App\Models\Order;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests OrderHistoryApiTest.
class OrderHistoryApiTest extends TestCase
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

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede listar ni ver pedidos.
    public function test_guest_cannot_list_or_view_orders(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // Esta línea sirve para hacer la petición a /api/v1/orders sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/orders')->assertUnauthorized();
        // Esta línea sirve para hacer la petición a /api/v1/orders/{$order->id} sin sesión y exigir que responda 401.
        $this->getJson("/api/v1/orders/{$order->id}")->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario solo ve sus propios pedidos en el listado.
    public function test_user_only_sees_their_own_orders_in_the_list(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $otherUser = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $this->makeOrder($user);
        // Esta línea sirve para crear otro pedido del usuario.
        $this->makeOrder($user);
        // Esta línea sirve para crear un pedido de otro usuario.
        $this->makeOrder($otherUser);

        // Esta línea sirve para hacer GET a /api/v1/orders autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/orders');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 2 elementos.
        $response->assertJsonCount(2, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que los pedidos se ordenan del más reciente al más antiguo.
    public function test_orders_are_sorted_most_recent_first(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido viejo.
        $older = $this->makeOrder($user);
        // created_at no está en $fillable (a propósito, no es mass-assignable) — se
        // asigna directo al atributo para simular un pedido más viejo en el test.
        // Esta línea sirve para fijar su fecha de hace 2 días.
        $older->created_at = now()->subDays(2);
        // Esta línea sirve para guardar el cambio.
        $older->save();
        // Esta línea sirve para crear un pedido nuevo.
        $newer = $this->makeOrder($user);

        // Esta línea sirve para hacer GET a /api/v1/orders autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/orders');

        // Esta línea sirve para exigir que "data.0.id" sea $newer->id.
        $response->assertJsonPath('data.0.id', $newer->id);
        // Esta línea sirve para exigir que "data.1.id" sea $older->id.
        $response->assertJsonPath('data.1.id', $older->id);
    }

    // Esta línea sirve para declarar el test que comprueba que el usuario puede ver el detalle de su pedido con productos.
    public function test_user_can_view_their_own_order_detail_with_items(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);
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

        // Esta línea sirve para hacer GET a /api/v1/orders/{$order->id} autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.id" sea $order->id.
        $response->assertJsonPath('data.id', $order->id);
        // Esta línea sirve para exigir que "data.items" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.items');
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario no puede ver el pedido de otro.
    public function test_a_user_cannot_view_another_users_order(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $otherUser = User::factory()->create();
        // Esta línea sirve para crear un pedido de otro usuario.
        $order = $this->makeOrder($otherUser);

        // Esta línea sirve para hacer la petición a /api/v1/orders/{$order->id} como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson("/api/v1/orders/{$order->id}")->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que un super admin puede ver cualquier pedido por este endpoint.
    public function test_super_admin_can_view_any_order_through_this_endpoint_too(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un pedido del usuario.
        $order = $this->makeOrder($user);

        // Esta línea sirve para hacer la petición a /api/v1/orders/{$order->id} como admin y exigir que responda 200.
        $this->actingAs($admin, 'sanctum')->getJson("/api/v1/orders/{$order->id}")->assertOk();
    }
}
