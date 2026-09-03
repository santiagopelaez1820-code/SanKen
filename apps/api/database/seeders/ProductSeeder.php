<?php

namespace Database\Seeders;

use App\Http\Requests\Admin\ProductRequest;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Catálogo de prueba para poder ver la tienda funcionando en localhost sin
 * depender de que el superadmin haya cargado productos reales todavía.
 */
class ProductSeeder extends Seeder
{
    public function run(): void
    {
        foreach (ProductRequest::CATEGORIES as $category) {
            Product::factory()->count(4)->forCategory($category)->create();
        }
    }
}
