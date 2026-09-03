<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_manage_products(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/admin/products')->assertForbidden();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/admin/products', [])->assertForbidden();
    }

    public function test_admin_can_list_all_products_including_inactive_ones(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        Product::factory()->create(['active' => true]);
        Product::factory()->inactive()->create();

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/products');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_a_product_and_the_slug_is_generated(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/products', [
            'name' => 'Creatina Monohidratada',
            'description' => 'Descripción larga del producto.',
            'short_description' => 'Descripción corta.',
            'category' => 'creatine',
            'price' => 79900,
            'dropi_reference' => 'DROPI-123',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.slug', 'creatina-monohidratada');
        $response->assertJsonPath('data.active', true);
        $response->assertJsonPath('data.dropi_reference', 'DROPI-123');
        $this->assertDatabaseHas('products', ['slug' => 'creatina-monohidratada']);
    }

    public function test_dropi_reference_is_hidden_from_the_public_resource(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $user = User::factory()->create();
        $product = Product::factory()->create(['dropi_reference' => 'DROPI-SECRETO']);

        $adminResponse = $this->actingAs($admin, 'sanctum')->getJson("/api/v1/admin/products");
        $adminResponse->assertJsonPath('data.0.dropi_reference', 'DROPI-SECRETO');

        $publicResponse = $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}");
        $publicResponse->assertJsonMissingPath('data.dropi_reference');
    }

    public function test_admin_can_update_and_deactivate_a_product(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 10000]);
        $client = $this->actingAs($admin, 'sanctum');

        $client->patchJson("/api/v1/admin/products/{$product->id}", ['price' => 25000])
            ->assertJsonPath('data.price', '25000.00');

        $client->deleteJson("/api/v1/admin/products/{$product->id}")
            ->assertJsonPath('data.active', false);
        $this->assertFalse($product->fresh()->active);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
