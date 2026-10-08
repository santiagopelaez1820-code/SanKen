<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones.

namespace App\Http\Requests;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la subida del video de un PR.
class UploadPrSubmissionVideoRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el dueño de la postulación lo verifica el controller).
        return true;
    }

    /**
     * Mismos límites que UploadExerciseVideoRequest (100M, mp4/webm/mov) —
     * requiere que upload_max_filesize/post_max_size del entorno también
     * estén en 100M o más, si no PHP trunca el archivo antes de que este
     * validador lo vea.
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
