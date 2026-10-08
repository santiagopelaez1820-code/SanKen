<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones.

namespace App\Http\Requests;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la subida de la foto de perfil.
class UpdateAvatarRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (la ruta ya exige sesión iniciada).
        return true;
    }

    /**
     * 5M es de sobra para una foto de perfil (no un video de demostración
     * de ejercicio) — igual que con exercise-videos, requiere que
     * upload_max_filesize/post_max_size del entorno permitan al menos eso.
     *
     * gif se agrega porque Laravel sí lo reconoce como imagen válida (la
     * regla `image` lo soporta) — no había motivo para excluirlo de `mimes`.
     * HEIC/HEIF no puede agregarse acá: Laravel/PHP no lo reconocen como
     * imagen server-side, por eso el mobile lo convierte a JPEG antes de
     * subirlo (ver AvatarEditSheet) en vez de aflojar esta validación.
     *
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir una imagen jpg, jpeg, png, webp o gif de hasta 5 MB.
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ];
    }
}
