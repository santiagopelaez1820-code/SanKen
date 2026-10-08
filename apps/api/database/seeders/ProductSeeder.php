<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar la validación de productos para usar sus categorías.
use App\Http\Requests\Admin\ProductRequest;
// Esta línea sirve para importar el modelo Product (producto).
use App\Models\Product;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

/**
 * Catálogo de prueba para poder ver la tienda funcionando en localhost sin
 * depender de que el superadmin haya cargado productos reales todavía.
 */
// Esta línea sirve para declarar el seeder que crea productos de prueba para la tienda.
class ProductSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para recorrer cada categoría de producto.
        foreach (ProductRequest::CATEGORIES as $category) {
            // Esta línea sirve para crear 4 productos de prueba de esa categoría.
            Product::factory()->count(4)->forCategory($category)->create();
        }
    }
}
