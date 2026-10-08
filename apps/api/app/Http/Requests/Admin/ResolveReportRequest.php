<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del admin.

namespace App\Http\Requests\Admin;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

// Esta línea sirve para declarar la validación para resolver un reporte.
class ResolveReportRequest extends FormRequest
{
    // Esta línea sirve para declarar el método que indica si el usuario puede hacer esta petición.
    public function authorize(): bool
    {
        // Esta línea sirve para permitir siempre (el permiso lo controla el middleware de rol).
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
            // Esta línea sirve para exigir que el estado sea "resolved" (resuelto) o "dismissed" (descartado).
            'status' => ['required', 'string', Rule::in(['resolved', 'dismissed'])],
            // Esta línea sirve para permitir opcionalmente notas de la resolución (hasta 2000 caracteres).
            'resolution_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
