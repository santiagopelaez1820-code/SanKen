<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\ReplacesPublicFile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Http\Requests\Admin\UploadProductImageRequest;
use App\Http\Resources\AdminProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    use ReplacesPublicFile;

    /**
     * A diferencia de ProductController::index (solo activos), acá se
     * listan todos — el admin necesita ver los inactivos para reactivarlos.
     */
    public function index(): JsonResponse
    {
        $products = Product::query()->orderByDesc('created_at')->get();

        return response()->json(['data' => AdminProductResource::collection($products)]);
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['name']);
        $data['active'] = $request->boolean('active', true);

        $product = Product::query()->create($data);

        return response()->json(['data' => new AdminProductResource($product)], 201);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('name', $data) && $data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        $product->update($data);

        return response()->json(['data' => new AdminProductResource($product)]);
    }

    /**
     * No borra la fila: products.id puede estar referenciado por
     * order_items ya creados. active=false lo saca del catálogo público sin
     * romper el historial de pedidos (mismo criterio que
     * AdminExerciseController::destroy).
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->update(['active' => false]);

        return response()->json(['data' => new AdminProductResource($product)]);
    }

    public function uploadImage(UploadProductImageRequest $request, Product $product): JsonResponse
    {
        $imageUrl = $this->storePublicFileReplacing(
            $request->file('image'),
            'product-images',
            $product->image,
            'No se pudo guardar la imagen.',
        );
        $product->update(['image' => $imageUrl]);

        return response()->json(['data' => new AdminProductResource($product->fresh())]);
    }

    public function deleteImage(Product $product): JsonResponse
    {
        $this->deletePublicFileByUrl($product->image);
        $product->update(['image' => null]);

        return response()->json(['data' => new AdminProductResource($product->fresh())]);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 2;

        while (
            Product::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query, $id) => $query->where('id', '!=', $id))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
