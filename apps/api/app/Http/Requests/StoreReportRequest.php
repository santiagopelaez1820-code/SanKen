<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
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
            // El único tipo reportable hoy es un mensaje de chat (ver
            // AppServiceProvider::boot(), Relation::morphMap) — la
            // lista acá y el morph map deben mantenerse en sync.
            'reportable_type' => ['required', 'string', Rule::in(['chat_message'])],
            'reportable_id' => ['required', 'integer'],
            'reason' => ['required', 'string', Rule::in(['abuse', 'spam', 'inappropriate_content', 'other'])],
            'details' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
