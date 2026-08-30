<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_products(): void
    {
        $this->getJson('/api/v1/products')->assertUnauthorized();
    }

    public function test_it_lists_only_active_products(): void
    {
        $user = User::factory()->create();
        Product::factory()->create(['name' => 'Activo']);
        Product::factory()->inactive()->create(['name' => 'Inactivo']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/products');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Activo');
    }

    public function test_it_filters_by_category(): void
    {
        $user = User::factory()->create();
        Product::factory()->create(['category' => 'protein']);
        Product::factory()->create(['category' => 'creatine']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/products?category=creatine');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.category', 'creatine');
    }

    public function test_show_returns_an_active_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}");

        $response->assertOk();
        $response->assertJsonPath('data.id', $product->id);
    }

    public function test_show_returns_404_for_an_inactive_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->inactive()->create();

        $this->actingAs($user, 'sanctum')->getJson("/api/v1/products/{$product->id}")->assertNotFound();
    }

    public function test_show_returns_404_for_a_nonexistent_product(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->getJson('/api/v1/products/999999')->assertNotFound();
    }
}
