<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mismos límites que RegisterPersonalRecordRequest (registro manual
     * privado) — el número en sí es igual de plausible acá, lo único que
     * cambia es que esta postulación necesita revisión antes de contar
     * para Rankings.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'exercise_id' => ['required', 'integer', 'exists:exercises,id'],
            'weight_kg' => ['required', 'numeric', 'min:0.1', 'max:1000'],
            'reps' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
