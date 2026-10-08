<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones del calendario.

namespace App\Http\Requests\Calendar;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;

// Esta línea sirve para declarar la validación de la creación de un recordatorio.
class StoreCalendarReminderRequest extends FormRequest
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
            // Esta línea sirve para exigir una fecha válida.
            'event_date' => ['required', 'date'],
            // Esta línea sirve para exigir el título (hasta 255 caracteres).
            'title' => ['required', 'string', 'max:255'],
            // Esta línea sirve para permitir opcionalmente notas (hasta 2000 caracteres).
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
