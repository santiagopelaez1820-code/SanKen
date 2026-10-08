<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones de soporte.

namespace App\Http\Requests\Support;

// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/** Gestión por el equipo: estado, prioridad y responsable (solo super_admin). */
// Esta línea sirve para declarar la validación de la gestión de una solicitud por el equipo.
class UpdateSupportTicketRequest extends FormRequest
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
            // Esta línea sirve para permitir opcionalmente un estado de los configurados.
            'status' => ['sometimes', 'string', Rule::in(config('support.ticket_statuses'))],
            // Esta línea sirve para permitir opcionalmente una prioridad de las configuradas.
            'priority' => ['sometimes', 'string', Rule::in(config('support.ticket_priorities'))],
            // Solo se puede asignar a alguien del equipo (super_admin).
            // Esta línea sirve para permitir opcionalmente asignar la solicitud a un super_admin (o quitar la asignación con null).
            'assigned_to' => ['sometimes', 'nullable', 'integer', Rule::exists('users', 'id')->where('role', 'super_admin')],
        ];
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si el responsable no es del equipo.
            'assigned_to.exists' => 'Solo se puede asignar a un miembro del equipo de SanKen.',
        ];
    }
}
