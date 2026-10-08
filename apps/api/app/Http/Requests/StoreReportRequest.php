<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones.

namespace App\Http\Requests;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación de la creación de un reporte.
class StoreReportRequest extends FormRequest
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
            // El único tipo reportable hoy es un mensaje de chat (ver
            // AppServiceProvider::boot(), Relation::morphMap) — la
            // lista acá y el morph map deben mantenerse en sync.
            // Esta línea sirve para exigir que el tipo de contenido sea un mensaje de chat.
            'reportable_type' => ['required', 'string', Rule::in(['chat_message'])],
            // Esta línea sirve para exigir el id del contenido reportado.
            'reportable_id' => ['required', 'integer'],
            // Esta línea sirve para exigir el motivo: abuso, spam, contenido inapropiado u otro.
            'reason' => ['required', 'string', Rule::in(['abuse', 'spam', 'inappropriate_content', 'other'])],
            // Esta línea sirve para permitir opcionalmente detalles (hasta 2000 caracteres).
            'details' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
