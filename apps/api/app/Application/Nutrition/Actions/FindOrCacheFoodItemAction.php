<?php

namespace App\Application\Nutrition\Actions;

use App\Domain\Nutrition\Services\OpenFoodFactsClient;
use App\Models\FoodItem;
use Illuminate\Support\Collection;

/**
 * Cache-then-fetch: mira food_items primero (la tabla hace también de
 * "barcode_cache", ver la migración), y solo pega contra Open Food Facts en
 * un miss — así una búsqueda repetida no vuelve a golpear la red ni el
 * límite de 15 req/min/IP de OFF.
 */
class FindOrCacheFoodItemAction
{
    public function __construct(
        private readonly OpenFoodFactsClient $client,
    ) {}

    public function byBarcode(string $barcode): ?FoodItem
    {
        $cached = FoodItem::query()->where('barcode', $barcode)->first();
        if ($cached) {
            return $cached;
        }

        $data = $this->client->findByBarcode($barcode);
        if ($data === null) {
            return null;
        }

        return FoodItem::query()->create($data);
    }

    /**
     * @return Collection<int, FoodItem>
     */
    public function search(string $query): Collection
    {
        $cached = FoodItem::query()->where('name', 'like', "%{$query}%")->limit(15)->get();
        if ($cached->isNotEmpty()) {
            return $cached;
        }

        return collect($this->client->search($query))
            ->map(function (array $data) {
                // firstOrCreate por barcode solo si hay barcode: una columna
                // única permite múltiples NULL, así que buscar por
                // barcode=null podría "encontrar" y devolver un food_item
                // de OTRO producto sin barcode ya cacheado antes.
                if ($data['barcode'] === null) {
                    return FoodItem::query()->create($data);
                }

                // updateOrCreate, no firstOrCreate: si este producto ya
                // estaba cacheado de ANTES de que OpenFoodFactsClient
                // empezara a pedir lc=es, se había guardado con el nombre
                // genérico/inglés — firstOrCreate devolvería ese registro
                // viejo tal cual, sin actualizar el nombre nunca, así que
                // una búsqueda futura en español seguiría sin poder
                // encontrarlo por el `where('name','like',...)` de arriba.
                return FoodItem::query()->updateOrCreate(['barcode' => $data['barcode']], $data);
            });
    }
}
