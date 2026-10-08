<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de administración.

namespace App\Http\Controllers\Api\V1\Admin;

// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar la validación de los datos de un producto.
use App\Http\Requests\Admin\ProductRequest;
// Esta línea sirve para importar la validación de la imagen de un producto.
use App\Http\Requests\Admin\UploadProductImageRequest;
// Esta línea sirve para importar el resource que da formato a un producto para el admin.
use App\Http\Resources\AdminProductResource;
// Esta línea sirve para importar el helper que define dónde se guarda cada archivo.
use App\Infrastructure\Media\MediaSlot;
// Esta línea sirve para importar la interfaz de almacenamiento de archivos.
use App\Infrastructure\Media\MediaStorage;
// Esta línea sirve para importar el modelo Product (producto).
use App\Models\Product;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar el helper Str para generar el slug.
use Illuminate\Support\Str;

// Esta línea sirve para agrupar este controller en la sección "Admin · Productos" de Swagger.
#[Group('Admin · Productos', 'Catálogo de la tienda: alta, edición, desactivación e imagen de cada producto.', weight: 31)]
// Esta línea sirve para declarar el controller de productos del panel admin.
class AdminProductController extends Controller
{
    /**
     * Listar todos los productos.
     *
     * A diferencia de ProductController::index (solo activos), acá se
     * listan todos — el admin necesita ver los inactivos para reactivarlos.
     */
    // Esta línea sirve para declarar el endpoint que lista todos los productos.
    public function index(): JsonResponse
    {
        // Esta línea sirve para obtener todos los productos del más reciente al más antiguo.
        $products = Product::query()->orderByDesc('created_at')->get();

        // Esta línea sirve para responder con los productos.
        return response()->json(['data' => AdminProductResource::collection($products)]);
    }

    /**
     * Crear un producto.
     *
     * El `slug` se genera a partir del nombre. Queda activo salvo que se
     * envíe `active: false`.
     */
    // Esta línea sirve para declarar el endpoint que crea un producto.
    public function store(ProductRequest $request): JsonResponse
    {
        // Esta línea sirve para obtener los datos validados.
        $data = $request->validated();
        // Esta línea sirve para generar un slug único a partir del nombre.
        $data['slug'] = $this->uniqueSlug($data['name']);
        // Esta línea sirve para dejar el producto activo salvo que se envíe lo contrario.
        $data['active'] = $request->boolean('active', true);

        // Esta línea sirve para crear el producto.
        $product = Product::query()->create($data);

        // Esta línea sirve para responder con el producto creado y código 201.
        return response()->json(['data' => new AdminProductResource($product)], 201);
    }

    /**
     * Editar un producto.
     *
     * Si cambia el nombre, se regenera el `slug`.
     */
    // Esta línea sirve para declarar el endpoint que edita un producto.
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        // Esta línea sirve para obtener los datos validados.
        $data = $request->validated();

        // Esta línea sirve para revisar si cambió el nombre.
        if (array_key_exists('name', $data) && $data['name'] !== $product->name) {
            // Esta línea sirve para regenerar el slug con el nombre nuevo.
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        // Esta línea sirve para actualizar el producto.
        $product->update($data);

        // Esta línea sirve para responder con el producto actualizado.
        return response()->json(['data' => new AdminProductResource($product)]);
    }

    /**
     * Desactivar un producto.
     *
     * No borra la fila: products.id puede estar referenciado por
     * order_items ya creados. active=false lo saca del catálogo público sin
     * romper el historial de pedidos (mismo criterio que
     * AdminExerciseController::destroy).
     */
    // Esta línea sirve para declarar el endpoint que desactiva un producto.
    public function destroy(Product $product): JsonResponse
    {
        // Esta línea sirve para marcar el producto como inactivo.
        $product->update(['active' => false]);

        // Esta línea sirve para responder con el producto actualizado.
        return response()->json(['data' => new AdminProductResource($product)]);
    }

    /**
     * Subir la imagen de un producto.
     *
     * Reemplaza la anterior, que solo se borra una vez guardada la nueva.
     */
    // Esta línea sirve para declarar el endpoint que sube la imagen de un producto.
    public function uploadImage(UploadProductImageRequest $request, Product $product, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para guardar la imagen y obtener su URL.
        $imageUrl = $media->store(
            // Esta línea sirve para pasar el archivo subido.
            $request->file('image'),
            // Esta línea sirve para pasar el destino del archivo.
            MediaSlot::productImage($product->id),
            // Esta línea sirve para pasar la URL anterior para borrarla después.
            $product->image,
            // Esta línea sirve para pasar el mensaje de error si falla.
            'No se pudo guardar la imagen.',
        );
        // Esta línea sirve para guardar la URL de la imagen en el producto.
        $product->update(['image' => $imageUrl]);

        // Esta línea sirve para responder con el producto recargado.
        return response()->json(['data' => new AdminProductResource($product->fresh())]);
    }

    /** Eliminar la imagen de un producto. */
    // Esta línea sirve para declarar el endpoint que elimina la imagen de un producto.
    public function deleteImage(Product $product, MediaStorage $media): JsonResponse
    {
        // Esta línea sirve para borrar el archivo de la imagen.
        $media->delete($product->image);
        // Esta línea sirve para limpiar la imagen del producto.
        $product->update(['image' => null]);

        // Esta línea sirve para responder con el producto recargado.
        return response()->json(['data' => new AdminProductResource($product->fresh())]);
    }

    // Esta línea sirve para declarar el método privado que genera un slug único.
    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        // Esta línea sirve para convertir el nombre en slug.
        $base = Str::slug($name);
        // Esta línea sirve para empezar con el slug base.
        $slug = $base;
        // Esta línea sirve para empezar el sufijo en 2.
        $suffix = 2;

        // Esta línea sirve para repetir mientras el slug ya exista.
        while (
            // Esta línea sirve para consultar los productos.
            Product::query()
                // Esta línea sirve para filtrar por ese slug.
                ->where('slug', $slug)
                // Esta línea sirve para excluir el propio producto si se indicó.
                ->when($ignoreId, fn ($query, $id) => $query->where('id', '!=', $id))
                // Esta línea sirve para revisar si existe alguno.
                ->exists()
        ) {
            // Esta línea sirve para probar con el slug base más el sufijo.
            $slug = "{$base}-{$suffix}";
            // Esta línea sirve para aumentar el sufijo.
            $suffix++;
        }

        // Esta línea sirve para devolver el slug único.
        return $slug;
    }
}
