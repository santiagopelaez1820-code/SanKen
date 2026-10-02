<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Gestión por el equipo: estado, prioridad y responsable (solo super_admin). */
class UpdateSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'string', Rule::in(config('support.ticket_statuses'))],
            'priority' => ['sometimes', 'string', Rule::in(config('support.ticket_priorities'))],
            // Solo se puede asignar a alguien del equipo (super_admin).
            'assigned_to' => ['sometimes', 'nullable', 'integer', Rule::exists('users', 'id')->where('role', 'super_admin')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'assigned_to.exists' => 'Solo se puede asignar a un miembro del equipo de SanKen.',
        ];
    }
}
