<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de estadísticas.

namespace App\Http\Requests\Stats;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la consulta de volumen.
class VolumeQueryRequest extends FormRequest
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
            // Esta línea sirve para permitir opcionalmente el rango semanal o mensual.
            'range' => ['nullable', 'string', 'in:weekly,monthly'],
        ];
    }
}
