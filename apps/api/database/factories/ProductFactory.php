<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar la validación de productos para usar sus categorías.
use App\Http\Requests\Admin\ProductRequest;
// Esta línea sirve para importar la clase base de las factories.
use App\Models\Product;
// Esta línea sirve para importar el helper Str para armar el slug.
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
// Esta línea sirve para declarar la factory que crea productos de prueba.
class ProductFactory extends Factory
{
    // Esta línea sirve para definir nombres de ejemplo por categoría.
    private const NAMES = [
        // Esta línea sirve para definir nombres de proteínas.
        'protein' => ['Whey Protein Concentrado', 'Isolate Protein', 'Whey Protein Gold', 'Proteína Vegana'],
        // Esta línea sirve para definir nombres de creatinas.
        'creatine' => ['Creatina Monohidratada', 'Creatina Micronizada', 'Creatina HCL', 'Creatina Kre-Alkalyn'],
        // Esta línea sirve para definir nombres de pre-entrenos.
        'pre_workout' => ['Pre-Entreno Explosivo', 'Pre-Workout C4', 'Pre-Entreno Pump', 'Pre-Workout Sin Cafeína'],
        // Esta línea sirve para definir nombres de aminoácidos.
        'amino_acids' => ['BCAA 2:1:1', 'EAA Aminoácidos Esenciales', 'Glutamina Pura', 'BCAA Recovery'],
        // Esta línea sirve para definir nombres de vitaminas.
        'vitamins' => ['Multivitamínico Deportivo', 'Vitamina D3', 'Omega 3', 'Zinc + Magnesio'],
        // Esta línea sirve para definir nombres de otros productos.
        'other' => ['Shaker SanKen', 'Barra Proteica', 'Cinturón de Entrenamiento', 'Straps de Agarre'],
    ];

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para elegir una categoría al azar.
        $category = fake()->randomElement(ProductRequest::CATEGORIES);
        // Esta línea sirve para elegir un nombre de esa categoría y agregarle un número.
        $name = fake()->randomElement(self::NAMES[$category]).' '.fake()->numberBetween(1, 999);

        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para usar el nombre elegido.
            'name' => $name,
            // Esta línea sirve para armar el slug a partir del nombre.
            'slug' => Str::slug($name),
            // Esta línea sirve para usar tres párrafos falsos como descripción.
            'description' => fake()->paragraphs(3, true),
            // Esta línea sirve para usar una oración falsa como descripción corta.
            'short_description' => fake()->sentence(10),
            // Esta línea sirve para dejar el producto sin imagen.
            'image' => null,
            // Esta línea sirve para usar la categoría elegida.
            'category' => $category,
            // Esta línea sirve para usar un precio entre 15.000 y 180.000.
            'price' => fake()->numberBetween(15000, 180000),
            // Esta línea sirve para marcarlo como activo.
            'active' => true,
            // Esta línea sirve para dejarlo sin referencia de Dropi.
            'dropi_reference' => null,
        ];
    }

    // Esta línea sirve para declarar el estado que fija la categoría del producto.
    public function forCategory(string $category): static
    {
        // Esta línea sirve para devolver el estado con los datos a cambiar.
        return $this->state(fn () => [
            // Esta línea sirve para usar la categoría recibida.
            'category' => $category,
            // Esta línea sirve para elegir un nombre de esa categoría.
            'name' => $name = fake()->randomElement(self::NAMES[$category]).' '.fake()->numberBetween(1, 999),
            // Esta línea sirve para armar el slug a partir del nombre.
            'slug' => Str::slug($name),
        ]);
    }

    // Esta línea sirve para declarar el estado de producto inactivo.
    public function inactive(): static
    {
        // Esta línea sirve para marcar el producto como inactivo.
        return $this->state(fn () => ['active' => false]);
    }
}
