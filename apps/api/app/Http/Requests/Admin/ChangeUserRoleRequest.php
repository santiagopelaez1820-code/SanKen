<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Solo 'user'/'trainer' son destinos válidos — 'super_admin' queda
     * deliberadamente afuera para que ningún request (manipulado o no)
     * pueda auto-promocionarse ni promocionar a otra cuenta a Super Admin
     * por esta vía.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::in(['user', 'trainer'])],
        ];
    }
}
