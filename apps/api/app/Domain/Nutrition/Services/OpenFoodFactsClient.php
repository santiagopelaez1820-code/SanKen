<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de nutrición.

namespace App\Domain\Nutrition\Services;

// Esta línea sirve para importar el cliente HTTP para consultar la API.
use Illuminate\Support\Facades\Http;

/**
 * Wrapper fino sobre la API pública de Open Food Facts (sin API key/cuenta,
 * a diferencia de USDA FoodData Central — ver el plan del Sprint 12). Exige
 * un User-Agent propio (no key, pero sí identificación) y tiene un límite de
 * 15 req/min/IP documentado — no hay reintento/backoff acá a propósito, un
 * 429 simplemente se propaga como "no encontrado" (ver FindOrCacheFoodItemAction).
 */
// Esta línea sirve para declarar el cliente de la API pública de Open Food Facts.
final class OpenFoodFactsClient
{
    // Esta línea sirve para definir la URL para buscar productos por código de barras.
    private const BARCODE_URL = 'https://world.openfoodfacts.org/api/v2/product';

    // Esta línea sirve para definir la URL para buscar productos por texto.
    private const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

    // Esta línea sirve para definir el User-Agent con el que se identifica la app ante la API.
    private const USER_AGENT = 'SanKen/1.0 (dev@sanken.app)';

    /**
     * @return array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}|null
     */
    // Esta línea sirve para declarar el método que busca un producto por código de barras.
    public function findByBarcode(string $barcode): ?array
    {
        // Esta línea sirve para hacer la petición enviando el User-Agent.
        $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
            // Esta línea sirve para pedir el producto con ese código de barras.
            ->get(self::BARCODE_URL.'/'.$barcode.'.json', [
                // Esta línea sirve para pedir solo los campos necesarios.
                'fields' => 'product_name,brands,nutriments,code',
                // lc=es: OFF devuelve el nombre localizado en español cuando
                // el producto lo tiene (product_name pasa a ser ese valor).
                // No manda `cc` (país): la app no está limitada a un solo
                // país, forzarlo angostaría la base de productos sin razón.
                // Esta línea sirve para pedir los nombres en español.
                'lc' => 'es',
            ]);

        // Esta línea sirve para revisar si la petición falló o el producto no existe.
        if (! $response->successful() || $response->json('status') !== 1) {
            // Esta línea sirve para devolver null porque no se encontró.
            return null;
        }

        // Esta línea sirve para convertir el producto al formato de la app y devolverlo.
        return $this->mapProduct($response->json('product'), $barcode);
    }

    /**
     * @return array<int, array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}>
     */
    // Esta línea sirve para declarar el método que busca productos por texto.
    public function search(string $query): array
    {
        // Esta línea sirve para hacer la petición enviando el User-Agent.
        $response = Http::withHeaders(['User-Agent' => self::USER_AGENT])
            // Esta línea sirve para pedir la búsqueda.
            ->get(self::SEARCH_URL, [
                // Esta línea sirve para enviar el texto buscado.
                'search_terms' => $query,
                // Esta línea sirve para pedir la respuesta en JSON.
                'json' => 1,
                // Esta línea sirve para limitar la búsqueda a 15 resultados.
                'page_size' => 15,
                // Esta línea sirve para pedir los nombres en español.
                'lc' => 'es',
            ]);

        // Esta línea sirve para revisar si la petición falló.
        if (! $response->successful()) {
            // Esta línea sirve para devolver una lista vacía.
            return [];
        }

        // Esta línea sirve para tomar los productos de la respuesta.
        return collect($response->json('products', []))
            // Esta línea sirve para quedarse con los que tienen nombre y calorías.
            ->filter(fn (array $product) => ! empty($product['product_name']) && isset($product['nutriments']['energy-kcal_100g']))
            // Esta línea sirve para convertir cada producto al formato de la app.
            ->map(fn (array $product) => $this->mapProduct($product, $product['code'] ?? null))
            // Esta línea sirve para reindexar la lista.
            ->values()
            // Esta línea sirve para convertir la colección en arreglo.
            ->all();
    }

    /**
     * @param  array<string, mixed>  $product
     * @return array{barcode: ?string, name: string, brand: ?string, calories_per_100g: float, protein_per_100g: float, carbs_per_100g: float, fat_per_100g: float, source_id: ?string}
     */
    // Esta línea sirve para declarar el método privado que convierte un producto al formato de la app.
    private function mapProduct(array $product, ?string $barcode): array
    {
        // Esta línea sirve para obtener los valores nutricionales del producto.
        $nutriments = $product['nutriments'] ?? [];

        // Esta línea sirve para devolver el producto con el formato de la app.
        return [
            // Esta línea sirve para incluir el código de barras.
            'barcode' => $barcode,
            // Esta línea sirve para incluir el nombre (o un texto por defecto).
            'name' => $product['product_name'] ?? 'Producto sin nombre',
            // Esta línea sirve para incluir la marca.
            'brand' => $product['brands'] ?? null,
            // Esta línea sirve para incluir las calorías por 100 gramos.
            'calories_per_100g' => (float) ($nutriments['energy-kcal_100g'] ?? 0),
            // Esta línea sirve para incluir la proteína por 100 gramos.
            'protein_per_100g' => (float) ($nutriments['proteins_100g'] ?? 0),
            // Esta línea sirve para incluir los carbohidratos por 100 gramos.
            'carbs_per_100g' => (float) ($nutriments['carbohydrates_100g'] ?? 0),
            // Esta línea sirve para incluir la grasa por 100 gramos.
            'fat_per_100g' => (float) ($nutriments['fat_100g'] ?? 0),
            // Esta línea sirve para incluir el identificador del producto en la fuente.
            'source_id' => $product['code'] ?? $barcode,
        ];
    }
}
