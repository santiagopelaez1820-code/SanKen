<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Sirve tanto para crear como para editar (mismo patrón que
 * NewsPromotionRequest). El slug nunca se acepta del cliente: se genera en
 * el controller a partir de `name`.
 *
 * @ignoreSchema Sin schema compartido: Scramble documenta POST y PATCH con sus propias reglas.
 */
// Esta línea sirve para declarar la validación para crear o editar un producto.
class ProductRequest extends FormRequest
{
    // Esta línea sirve para definir las categorías de producto permitidas.
    public const CATEGORIES = ['protein', 'creatine', 'pre_workout', 'amino_acids', 'vitamins', 'other'];

    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para hacer los campos opcionales al editar (PATCH) y obligatorios al crear.
        $sometimesOnUpdate = $this->isMethod('patch') ? 'sometimes' : 'required';

        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para validar el nombre (hasta 150 caracteres).
            'name' => [$sometimesOnUpdate, 'string', 'max:150'],
            // Esta línea sirve para validar la descripción.
            'description' => [$sometimesOnUpdate, 'string'],
            // Esta línea sirve para validar la descripción corta (hasta 200 caracteres).
            'short_description' => [$sometimesOnUpdate, 'string', 'max:200'],
            // Esta línea sirve para validar que la categoría sea una de las permitidas.
            'category' => [$sometimesOnUpdate, 'string', Rule::in(self::CATEGORIES)],
            // Esta línea sirve para validar que el precio sea un número mayor o igual a 0.
            'price' => [$sometimesOnUpdate, 'numeric', 'min:0'],
            // Esta línea sirve para permitir opcionalmente activar o desactivar el producto.
            'active' => ['sometimes', 'boolean'],
            // Esta línea sirve para permitir opcionalmente la referencia del proveedor Dropi.
            'dropi_reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
