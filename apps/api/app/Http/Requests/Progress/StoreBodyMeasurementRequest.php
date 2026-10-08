<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de progreso.

namespace App\Http\Requests\Progress;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación del registro de una medida corporal.
class StoreBodyMeasurementRequest extends FormRequest
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
            // Esta línea sirve para permitir opcionalmente la fecha de la medición, que no puede ser futura.
            'measured_at' => ['nullable', 'date', 'before_or_equal:today'],
            // Esta línea sirve para permitir opcionalmente el peso (0 a 999 kg).
            'weight_kg' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente el porcentaje de grasa (0 a 100).
            'body_fat_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            // Esta línea sirve para permitir opcionalmente el pecho en cm.
            'chest_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente la cintura en cm.
            'waist_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente la cadera en cm.
            'hip_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente el brazo en cm.
            'arm_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente el muslo en cm.
            'thigh_cm' => ['nullable', 'numeric', 'min:0', 'max:999'],
            // Esta línea sirve para permitir opcionalmente la URL de la foto de progreso.
            'progress_photo_url' => ['nullable', 'string', 'url', 'max:2048'],
        ];
    }

    // Esta línea sirve para declarar el método que agrega validaciones extra.
    public function withValidator($validator): void
    {
        // Esta línea sirve para definir la lista de campos de medida.
        $metrics = ['weight_kg', 'body_fat_pct', 'chest_cm', 'waist_cm', 'hip_cm', 'arm_cm', 'thigh_cm'];

        // Esta línea sirve para agregar una validación que se ejecuta después de las reglas.
        $validator->after(function ($validator) use ($metrics) {
            // Esta línea sirve para revisar si no se envió ninguna medida.
            if (collect($metrics)->every(fn (string $field) => $this->input($field) === null)) {
                // Esta línea sirve para agregar el error que pide al menos una medida.
                $validator->errors()->add('weight_kg', 'At least one measurement field is required.');
            }
        });
    }
}
