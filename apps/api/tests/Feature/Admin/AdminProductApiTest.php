<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Admin.

namespace Tests\Feature\Admin;

// Esta línea sirve para importar el modelo Product.
use App\Models\Product;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests AdminProductApiTest.
class AdminProductApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario normal no puede gestionar productos.
    public function test_non_admin_cannot_manage_products(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer la petición a /api/v1/admin/products como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/products')->assertForbidden();
        // Esta línea sirve para hacer la petición a /api/v1/admin/products como user y exigir que responda 403.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/products', [])->assertForbidden();
    }

    // Esta línea sirve para declarar el test que comprueba que el admin ve todos los productos, incluso los inactivos.
    public function test_admin_can_list_all_products_including_inactive_ones(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto activo.
        Product::factory()->create(['active' => true]);
        // Esta línea sirve para crear un producto inactivo.
        Product::factory()->inactive()->create();

        // Esta línea sirve para hacer GET a /api/v1/admin/products autenticado como admin.
        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/products');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 2 elementos.
        $response->assertJsonCount(2, 'data');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede crear un producto y se genera el slug.
    public function test_admin_can_create_a_product_and_the_slug_is_generated(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);

        // Esta línea sirve para hacer POST a /api/v1/admin/products autenticado como admin con estos datos.
        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/products', [
            // Esta línea sirve para asignar 'Creatina Monohidratada' al campo "name".
            'name' => 'Creatina Monohidratada',
            // Esta línea sirve para asignar 'Descripción larga del producto.' al campo "description".
            'description' => 'Descripción larga del producto.',
            // Esta línea sirve para asignar 'Descripción corta.' al campo "short_description".
            'short_description' => 'Descripción corta.',
            // Esta línea sirve para asignar 'creatine' al campo "category".
            'category' => 'creatine',
            // Esta línea sirve para asignar 79900 al campo "price".
            'price' => 79900,
            // Esta línea sirve para asignar 'DROPI-123' al campo "dropi_reference".
            'dropi_reference' => 'DROPI-123',
        ]);

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que "data.slug" sea 'creatina-monohidratada'.
        $response->assertJsonPath('data.slug', 'creatina-monohidratada');
        // Esta línea sirve para exigir que "data.active" sea true.
        $response->assertJsonPath('data.active', true);
        // Esta línea sirve para exigir que "data.dropi_reference" sea 'DROPI-123'.
        $response->assertJsonPath('data.dropi_reference', 'DROPI-123');
        // Esta línea sirve para exigir que la tabla products tenga ese registro.
        $this->assertDatabaseHas('products', ['slug' => 'creatina-monohidratada']);
    }

    // Esta línea sirve para declarar el test que comprueba que la referencia de Dropi no se muestra en la vista pública.
    public function test_dropi_reference_is_hidden_from_the_public_resource(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto con referencia de Dropi.
        $product = Product::factory()->create(['dropi_reference' => 'DROPI-SECRETO']);

        // Esta línea sirve para hacer GET al listado del admin.
        $adminResponse = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/products');
        // Esta línea sirve para exigir que el admin sí vea la referencia de Dropi.
        $adminResponse->assertJsonPath('data.0.dropi_reference', 'DROPI-SECRETO');

        // Esta línea sirve para hacer GET al producto desde la vista pública.
        $publicResponse = $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}");
        // Esta línea sirve para exigir que la vista pública no incluya la referencia de Dropi.
        $publicResponse->assertJsonMissingPath('data.dropi_reference');
    }

    // Esta línea sirve para declarar el test que comprueba que el admin puede editar y desactivar un producto.
    public function test_admin_can_update_and_deactivate_a_product(): void
    {
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 10.000.
        $product = Product::factory()->create(['price' => 10000]);
        // Esta línea sirve para guardar el cliente HTTP autenticado como admin.
        $client = $this->actingAs($admin, 'sanctum');

        // Esta línea sirve para hacer PATCH para cambiar el precio a 25.000.
        $client->patchJson("/api/v1/admin/products/{$product->id}", ['price' => 25000])
            // Esta línea sirve para exigir que "data.price" sea '25000.00'.
            ->assertJsonPath('data.price', '25000.00');

        // Esta línea sirve para hacer DELETE del producto.
        $client->deleteJson("/api/v1/admin/products/{$product->id}")
            // Esta línea sirve para exigir que "data.active" sea false.
            ->assertJsonPath('data.active', false);
        // Esta línea sirve para exigir que en la base de datos quede inactivo.
        $this->assertFalse($product->fresh()->active);
        // Esta línea sirve para exigir que la tabla products tenga ese registro.
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
