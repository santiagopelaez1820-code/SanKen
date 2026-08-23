<?php

namespace App\Domain\Nutrition\Services;

use Illuminate\Support\Facades\Http;

/**
 * Wrapper fino sobre la API pública de Open Food Facts (sin API key/cuenta,
 * a diferencia de USDA FoodData Central — ver el plan del Sprint 12). Exige
 * un User-Agent propio (no key, pero sí identificación) y tiene un límite de
 * 15 req/min/IP documentado — no hay reintento/backoff acá a propósito, un
 * 429 simplemente se propaga como "no encontrado" (ver FindOrCacheFoodItemAction).
 */
final class OpenFoodFactsClient
{
    private const BARCODE_URL = 'https://world.openfoodfacts.org/api/v2/product';

    private const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

    private const USER_AGENT = 'SanKen/1.0 (dev@sanken.app)';

    /**
     * @return array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}|null
     */
    public function findByBarcode(string $barcode): ?array
    {
        $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
            ->get(self::BARCODE_URL.'/'.$barcode.'.json', [
                'fields' => 'product_name,brands,nutriments,code',
                // lc=es: OFF devuelve el nombre localizado en español cuando
                // el producto lo tiene (product_name pasa a ser ese valor).
                // No manda `cc` (país): la app no está limitada a un solo
                // país, forzarlo angostaría la base de productos sin razón.
                'lc' => 'es',
            ]);

        if (! $response->successful() || $response->json('status') !== 1) {
            return null;
        }

        return $this->mapProduct($response->json('product'), $barcode);
    }

    /**
     * @return array<int, array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}>
     */
    public function search(string $query): array
    {
        $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
            ->get(self::SEARCH_URL, [
                'search_terms' => $query,
                'json' => 1,
                'page_size' => 15,
                'lc' => 'es',
            ]);

        if (! $response->successful()) {
            return [];
        }

        return collect($response->json('products', []))
            ->filter(fn (array $product) => ! empty($product['product_name']) && isset($product['nutriments']['energy-kcal_100g']))
            ->map(fn (array $product) => $this->mapProduct($product, $product['code'] ?? null))
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $product
     * @return array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}
     */
    private function mapProduct(array $product, ?string $barcode): array
    {
        $nutriments = $product['nutriments'] ?? [];

        return [
            'barcode' => $barcode,
            'name' => $product['product_name'] ?? 'Producto sin nombre',
            'brand' => $product['brands'] ?? null,
            'calories_per_100g' => (float) ($nutriments['energy-kcal_100g'] ?? 0),
            'protein_per_100g' => (float) ($nutriments['proteins_100g'] ?? 0),
            'carbs_per_100g' => (float) ($nutriments['carbohydrates_100g'] ?? 0),
            'fat_per_100g' => (float) ($nutriments['fat_100g'] ?? 0),
            'source_id' => $product['code'] ?? $barcode,
        ];
    }
}
