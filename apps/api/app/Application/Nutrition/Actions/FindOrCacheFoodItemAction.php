<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de nutrición.

namespace App\Application\Nutrition\Actions;

// Esta línea sirve para importar el cliente de la API de Open Food Facts.
use App\Domain\Nutrition\Services\OpenFoodFactsClient;
// Esta línea sirve para importar el modelo FoodItem (alimento).
use App\Models\FoodItem;
// Esta línea sirve para importar la clase Collection para el tipo de retorno.
use Illuminate\Support\Collection;

/**
 * Cache-then-fetch: mira food_items primero (la tabla hace también de
 * "barcode_cache", ver la migración), y solo pega contra Open Food Facts en
 * un miss — así una búsqueda repetida no vuelve a golpear la red ni el
 * límite de 15 req/min/IP de OFF.
 */
// Esta línea sirve para declarar la acción que busca alimentos primero en la base y luego en Open Food Facts.
class FindOrCacheFoodItemAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el cliente de Open Food Facts.
        private readonly OpenFoodFactsClient $client,
    ) {}

    // Esta línea sirve para declarar el método que busca un alimento por su código de barras.
    public function byBarcode(string $barcode): ?FoodItem
    {
        // Esta línea sirve para buscar el alimento ya guardado con ese código de barras.
        $cached = FoodItem::query()->where('barcode', $barcode)->first();
        // Esta línea sirve para revisar si ya estaba guardado.
        if ($cached) {
            // Esta línea sirve para devolver el alimento guardado sin consultar la red.
            return $cached;
        }

        // Esta línea sirve para consultar el código de barras en Open Food Facts.
        $data = $this->client->findByBarcode($barcode);
        // Esta línea sirve para revisar si Open Food Facts no lo encontró.
        if ($data === null) {
            // Esta línea sirve para devolver null porque el alimento no existe.
            return null;
        }

        // Esta línea sirve para guardar el alimento encontrado en la base y devolverlo.
        return FoodItem::query()->create($data);
    }

    /**
     * @return Collection<int, FoodItem>
     */
    // Esta línea sirve para declarar el método que busca alimentos por nombre.
    public function search(string $query): Collection
    {
        // Esta línea sirve para buscar hasta 15 alimentos guardados cuyo nombre contenga el texto.
        $cached = FoodItem::query()->where('name', 'like', "%{$query}%")->limit(15)->get();
        // Esta línea sirve para revisar si encontró alguno en la base.
        if ($cached->isNotEmpty()) {
            // Esta línea sirve para devolver los alimentos guardados sin consultar la red.
            return $cached;
        }

        // Esta línea sirve para buscar en Open Food Facts y convertir el resultado en colección.
        return collect($this->client->search($query))
            // Esta línea sirve para transformar cada resultado en un alimento guardado.
            ->map(function (array $data) {
                // firstOrCreate por barcode solo si hay barcode: una columna
                // única permite múltiples NULL, así que buscar por
                // barcode=null podría "encontrar" y devolver un food_item
                // de OTRO producto sin barcode ya cacheado antes.
                // Esta línea sirve para revisar si el producto no tiene código de barras.
                if ($data['barcode'] === null) {
                    // Esta línea sirve para crearlo como alimento nuevo.
                    return FoodItem::query()->create($data);
                }

                // updateOrCreate, no firstOrCreate: si este producto ya
                // estaba cacheado de ANTES de que OpenFoodFactsClient
                // empezara a pedir lc=es, se había guardado con el nombre
                // genérico/inglés — firstOrCreate devolvería ese registro
                // viejo tal cual, sin actualizar el nombre nunca, así que
                // una búsqueda futura en español seguiría sin poder
                // encontrarlo por el `where('name','like',...)` de arriba.
                // Esta línea sirve para crearlo o actualizarlo usando su código de barras como clave.
                return FoodItem::query()->updateOrCreate(['barcode' => $data['barcode']], $data);
            });
    }
}
