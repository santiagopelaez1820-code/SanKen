<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de nutrición.

namespace App\Http\Requests\Nutrition;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación del registro de una comida.
class LogMealRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
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
            // Esta línea sirve para exigir que el alimento exista.
            'food_item_id' => ['required', 'integer', 'exists:food_items,id'],
            // Esta línea sirve para exigir el tipo de comida: desayuno, almuerzo, cena o snack.
            'meal_type' => ['required', Rule::in(['breakfast', 'lunch', 'dinner', 'snack'])],
            // Esta línea sirve para exigir la cantidad entre 1 y 5000 gramos.
            'quantity_grams' => ['required', 'numeric', 'min:1', 'max:5000'],
            // Esta línea sirve para permitir opcionalmente la fecha de la comida.
            'logged_at' => ['nullable', 'date'],
        ];
    }
}
