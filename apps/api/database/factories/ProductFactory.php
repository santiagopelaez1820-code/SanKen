<?php

namespace Database\Factories;

use App\Http\Requests\Admin\ProductRequest;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    private const NAMES = [
        'protein' => ['Whey Protein Concentrado', 'Isolate Protein', 'Whey Protein Gold', 'Proteína Vegana'],
        'creatine' => ['Creatina Monohidratada', 'Creatina Micronizada', 'Creatina HCL', 'Creatina Kre-Alkalyn'],
        'pre_workout' => ['Pre-Entreno Explosivo', 'Pre-Workout C4', 'Pre-Entreno Pump', 'Pre-Workout Sin Cafeína'],
        'amino_acids' => ['BCAA 2:1:1', 'EAA Aminoácidos Esenciales', 'Glutamina Pura', 'BCAA Recovery'],
        'vitamins' => ['Multivitamínico Deportivo', 'Vitamina D3', 'Omega 3', 'Zinc + Magnesio'],
        'other' => ['Shaker SanKen', 'Barra Proteica', 'Cinturón de Entrenamiento', 'Straps de Agarre'],
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = fake()->randomElement(ProductRequest::CATEGORIES);
        $name = fake()->randomElement(self::NAMES[$category]).' '.fake()->numberBetween(1, 999);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(10),
            'image' => null,
            'category' => $category,
            'price' => fake()->numberBetween(15000, 180000),
            'active' => true,
            'dropi_reference' => null,
        ];
    }

    public function forCategory(string $category): static
    {
        return $this->state(fn () => [
            'category' => $category,
            'name' => $name = fake()->randomElement(self::NAMES[$category]).' '.fake()->numberBetween(1, 999),
            'slug' => Str::slug($name),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['active' => false]);
    }
}
