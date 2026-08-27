<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
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
    public function rules(): array
    {
        return [
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ];
    }
}
