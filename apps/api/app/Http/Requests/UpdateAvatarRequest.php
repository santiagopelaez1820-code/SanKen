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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
