<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un producto.
use App\Http\Resources\ProductResource;
// Esta línea sirve para importar el modelo Product (producto de la tienda).
use App\Models\Product;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Tienda" de Swagger.
#[Group('Tienda', 'Catálogo de productos y pedidos del usuario.', weight: 19)]
// Esta línea sirve para declarar el controller del catálogo de la tienda.
class ProductController extends Controller
{
    /**
     * Listar el catálogo de la tienda.
     *
     * Catálogo de la tienda para usuarios autenticados. No pagina (mismo
     * criterio que ExerciseController::index): el catálogo se pinta
     * completo en la grilla del mobile.
     */
    // Esta línea sirve para declarar el endpoint que lista el catálogo.
    public function index(Request $request): JsonResponse
    {
        // Esta línea sirve para consultar los productos.
        $products = Product::query()
            // Esta línea sirve para filtrar solo los activos.
            ->active()
            // Esta línea sirve para filtrar por categoría si se envió una.
            ->when($request->query('category'), fn ($query, $category) => $query->where('category', $category))
            // Esta línea sirve para ordenar del más nuevo al más viejo.
            ->orderByDesc('created_at')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con los productos con su formato.
        return response()->json(['data' => ProductResource::collection($products)]);
    }

    /**
     * Ver un producto.
     *
     * Responde 404 si el producto no está activo.
     */
    // Esta línea sirve para declarar el endpoint que muestra un producto.
    public function show(Product $product): JsonResponse
    {
        // Esta línea sirve para responder 404 si el producto no está activo.
        abort_if(! $product->active, 404);

        // Esta línea sirve para responder con el producto con su formato.
        return response()->json(['data' => new ProductResource($product)]);
    }
}
