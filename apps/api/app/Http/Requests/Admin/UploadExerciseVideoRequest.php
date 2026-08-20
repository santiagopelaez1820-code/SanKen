<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadExerciseVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * mp4 primero (prioridad del pedido), webm/mov aceptados también.
     * 100M es el techo elegido para clips cortos de demostración de
     * ejercicio — requiere que upload_max_filesize/post_max_size del
     * entorno también estén en 100M o más (ver README de despliegue),
     * si no PHP trunca el archivo antes de que este validador lo vea.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:102400'],
        ];
    }
}
