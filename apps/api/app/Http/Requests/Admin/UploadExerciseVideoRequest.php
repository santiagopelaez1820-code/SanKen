<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la subida del video de un ejercicio.
class UploadExerciseVideoRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
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
    // Esta línea sirve para declarar las reglas de validación.
    public function rules(): array
    {
        // Esta línea sirve para devolver las reglas.
        return [
            // Esta línea sirve para exigir un video mp4, webm o mov de hasta 100 MB.
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:102400'],
        ];
    }
}
