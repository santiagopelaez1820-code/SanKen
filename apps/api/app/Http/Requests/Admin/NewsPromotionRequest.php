<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

/**
 * Sirve tanto para crear como para editar: en PATCH todos los campos son
 * opcionales.
 *
 * @ignoreSchema Sin schema compartido: Scramble documenta POST y PATCH con sus propias reglas.
 */
// Esta línea sirve para declarar la validación para crear o editar una noticia o promoción.
class NewsPromotionRequest extends FormRequest
{
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
            // Esta línea sirve para validar el título (hasta 200 caracteres).
            'title' => [$sometimesOnUpdate, 'string', 'max:200'],
            // Esta línea sirve para validar el cuerpo.
            'body' => [$sometimesOnUpdate, 'string'],
            // Esta línea sirve para permitir opcionalmente la URL de la imagen (hasta 500 caracteres).
            'image_url' => ['nullable', 'string', 'max:500'],
            // Esta línea sirve para permitir opcionalmente publicar o despublicar.
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
