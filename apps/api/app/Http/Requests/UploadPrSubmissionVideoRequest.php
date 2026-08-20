<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadPrSubmissionVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
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
    public function rules(): array
    {
        return [
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:102400'],
        ];
    }
}
