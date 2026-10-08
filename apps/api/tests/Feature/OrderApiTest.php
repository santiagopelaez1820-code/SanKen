<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo Product.
use App\Models\Product;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests OrderApiTest.
class OrderApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

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

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede crear un pedido.
    public function test_guest_cannot_create_an_order(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/orders sin sesión y exigir que responda 401.
        $this->postJson('/api/v1/orders', [])->assertUnauthorized();
    }

    /**
     * Caso de seguridad clave: aunque el cliente mande un precio manipulado
     * dentro de items, el backend jamás lo lee — solo product_id/quantity
     * viajan en el payload, así que el total sale exclusivamente de lo que
     * hay en la base de datos.
     */
    // Esta línea sirve para declarar el test que comprueba que los precios se recalculan desde la base de datos ignorando los del cliente.
    public function test_it_recalculates_prices_from_the_database_ignoring_any_client_input(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto de 50.000.
        $product = Product::factory()->create(['price' => 50000]);

        // Esta línea sirve para armar los datos del checkout.
        $payload = $this->checkoutPayload([
            // Esta línea sirve para enviar el producto con un precio falso de 1.
            ['product_id' => $product->id, 'quantity' => 2, 'unit_price' => 1, 'price' => 1],
        ]);

        // Esta línea sirve para hacer POST a /api/v1/orders autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.subtotal" sea '100000.00'.
        $response->assertJsonPath('data.subtotal', '100000.00');
        // Esta línea sirve para exigir que "data.total" sea '100000.00'.
        $response->assertJsonPath('data.total', '100000.00');
        // Esta línea sirve para exigir que "data.items.0.unit_price" sea '50000.00'.
        $response->assertJsonPath('data.items.0.unit_price', '50000.00');
        // Esta línea sirve para exigir que la tabla order_items tenga ese registro.
        $this->assertDatabaseHas('order_items', ['product_id' => $product->id, 'unit_price' => 50000, 'quantity' => 2]);
    }

    // Esta línea sirve para declarar el test que comprueba que el total se calcula bien con varios productos.
    public function test_it_computes_the_total_correctly_with_multiple_items(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear el producto A de 30.000.
        $productA = Product::factory()->create(['price' => 30000]);
        // Esta línea sirve para crear el producto B de 45.000.
        $productB = Product::factory()->create(['price' => 45000]);

        // Esta línea sirve para armar los datos del checkout.
        $payload = $this->checkoutPayload([
            // Esta línea sirve para agregar 2 unidades del producto A.
            ['product_id' => $productA->id, 'quantity' => 2],
            // Esta línea sirve para agregar 1 unidad del producto B.
            ['product_id' => $productB->id, 'quantity' => 1],
        ]);

        // Esta línea sirve para hacer POST a /api/v1/orders autenticado como user con los datos enviados.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $payload);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // 30000*2 + 45000*1 = 105000
        // Esta línea sirve para exigir que "data.subtotal" sea '105000.00'.
        $response->assertJsonPath('data.subtotal', '105000.00');
        // Esta línea sirve para exigir que "data.total" sea '105000.00'.
        $response->assertJsonPath('data.total', '105000.00');
        // Esta línea sirve para exigir que "data.items" tenga 2 elementos.
        $response->assertJsonCount(2, 'data.items');
    }

    // Esta línea sirve para declarar el test que comprueba que los pedidos nuevos empiezan como pendientes.
    public function test_new_orders_start_as_pending(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();

        // Esta línea sirve para crear el pedido como el usuario.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
        ]));

        // Esta línea sirve para exigir que "data.status" sea 'pending'.
        $response->assertJsonPath('data.status', 'pending');
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza un producto inactivo.
    public function test_it_rejects_an_inactive_product(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto inactivo.
        $product = Product::factory()->inactive()->create();

        // Esta línea sirve para intentar crear el pedido.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
            // Esta línea sirve para cerrar los datos y exigir 422.
        ]))->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba que se rechaza un producto inexistente.
    public function test_it_rejects_a_nonexistent_product(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para intentar crear el pedido.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar un producto que no existe.
            ['product_id' => 999999, 'quantity' => 1],
            // Esta línea sirve para cerrar los datos y exigir 422.
        ]))->assertStatus(422);
    }

    // Esta línea sirve para declarar el test que comprueba los límites de la cantidad.
    public function test_it_validates_quantity_bounds(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();

        // Esta línea sirve para intentar crear un pedido con cantidad 0.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar el producto con cantidad 0.
            ['product_id' => $product->id, 'quantity' => 0],
            // Esta línea sirve para cerrar los datos y exigir 422.
        ]))->assertStatus(422);

        // Esta línea sirve para intentar crear un pedido con cantidad 51.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar el producto con cantidad 51.
            ['product_id' => $product->id, 'quantity' => 51],
            // Esta línea sirve para cerrar los datos y exigir 422.
        ]))->assertStatus(422);
    }

    /**
     * El regex de teléfono antes solo exigía 7-20 caracteres del set
     * [0-9 -], sin exigir que alguno fuera realmente un dígito — un valor
     * como "-------" (puros guiones) pasaba la validación.
     */
    // Esta línea sirve para declarar el test que comprueba que se rechaza un teléfono sin dígitos.
    public function test_it_rejects_a_phone_with_no_actual_digits(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();

        // Esta línea sirve para intentar crear el pedido.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload(
            // Esta línea sirve para agregar una unidad del producto.
            [['product_id' => $product->id, 'quantity' => 1]],
            // Esta línea sirve para enviar celular y WhatsApp sin dígitos.
            ['customer_phone' => '-------', 'customer_whatsapp' => '-------'],
            // Esta línea sirve para exigir 422 con errores en celular y WhatsApp.
        ))->assertStatus(422)->assertJsonValidationErrors(['customer_phone', 'customer_whatsapp']);
    }

    /**
     * order_items conserva el nombre/precio del momento del pedido aunque
     * el producto cambie después — así el historial nunca se reescribe.
     */
    // Esta línea sirve para declarar el test que comprueba que los productos del pedido conservan el nombre y precio históricos.
    public function test_order_items_keep_the_historical_name_and_price_after_the_product_changes(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto con nombre y precio originales.
        $product = Product::factory()->create(['name' => 'Creatina Original', 'price' => 60000]);

        // Esta línea sirve para crear el pedido.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para cambiar el nombre y el precio del producto.
        $product->update(['name' => 'Creatina Renombrada', 'price' => 90000]);

        // Esta línea sirve para exigir que la tabla order_items tenga un registro con estos datos.
        $this->assertDatabaseHas('order_items', [
            // Esta línea sirve para asignar $product->id al campo "product_id".
            'product_id' => $product->id,
            // Esta línea sirve para asignar 'Creatina Original' al campo "product_name".
            'product_name' => 'Creatina Original',
            // Esta línea sirve para asignar 60000 al campo "unit_price".
            'unit_price' => 60000,
        ]);
    }
}
