<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de nutrición.

namespace App\Http\Requests\Nutrition;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación del reemplazo de un alimento del plan.
class SubstituteMealItemRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso sobre el ítem lo verifica el controller).
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir que el alimento nuevo exista.
            'food_item_id' => ['required', 'integer', 'exists:food_items,id'],
        ];
    }
}
