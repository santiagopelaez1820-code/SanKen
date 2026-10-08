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

// Esta línea sirve para declarar la clase de tests ProductApiTest.
class ProductApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede listar productos.
    public function test_guest_cannot_list_products(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/products sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/products')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el listado solo trae productos activos.
    public function test_it_lists_only_active_products(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto activo.
        Product::factory()->create(['name' => 'Activo']);
        // Esta línea sirve para crear un producto inactivo.
        Product::factory()->inactive()->create(['name' => 'Inactivo']);

        // Esta línea sirve para hacer GET a /api/v1/products autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/products');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.name" sea 'Activo'.
        $response->assertJsonPath('data.0.name', 'Activo');
    }

    // Esta línea sirve para declarar el test que comprueba que el listado se puede filtrar por categoría.
    public function test_it_filters_by_category(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto de proteína.
        Product::factory()->create(['category' => 'protein']);
        // Esta línea sirve para crear un producto de creatina.
        Product::factory()->create(['category' => 'creatine']);

        // Esta línea sirve para hacer GET a /api/v1/products?category=creatine autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/products?category=creatine');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.category" sea 'creatine'.
        $response->assertJsonPath('data.0.category', 'creatine');
    }

    // Esta línea sirve para declarar el test que comprueba que ver un producto activo lo devuelve.
    public function test_show_returns_an_active_product(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto.
        $product = Product::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/products/{$product->id} autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.id" sea $product->id.
        $response->assertJsonPath('data.id', $product->id);
    }

    // Esta línea sirve para declarar el test que comprueba que ver un producto inactivo responde 404.
    public function test_show_returns_404_for_an_inactive_product(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un producto inactivo.
        $product = Product::factory()->inactive()->create();

        // Esta línea sirve para pedir el producto como usuario y exigir 404.
        $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}")->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que ver un producto inexistente responde 404.
    public function test_show_returns_404_for_a_nonexistent_product(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para pedir un producto que no existe y exigir 404.
        $this->actingAs($user, 'sanctum')->getJson('/api/v1/products/999999')->assertNotFound();
    }
}
