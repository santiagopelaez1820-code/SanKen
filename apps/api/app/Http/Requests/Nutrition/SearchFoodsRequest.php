<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de nutrición.

namespace App\Http\Requests\Nutrition;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la búsqueda de alimentos.
class SearchFoodsRequest extends FormRequest
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
            // Esta línea sirve para exigir el código de barras si no se envió texto.
            'barcode' => ['required_without:q', 'string'],
            // Esta línea sirve para exigir el texto (mínimo 2 caracteres) si no se envió código de barras.
            'q' => ['required_without:barcode', 'string', 'min:2'],
        ];
    }
}
