<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Catálogo de la tienda para usuarios autenticados. No pagina (mismo
     * criterio que ExerciseController::index): el catálogo se pinta
     * completo en la grilla del mobile.
     */
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->active()
            ->when($request->query('category'), fn ($query, $category) => $query->where('category', $category))
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => ProductResource::collection($products)]);
    }

    public function show(Product $product): JsonResponse
    {
        abort_if(! $product->active, 404);

        return response()->json(['data' => new ProductResource($product)]);
    }
}
