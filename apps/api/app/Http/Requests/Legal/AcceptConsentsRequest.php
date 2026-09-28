<?php

namespace App\Http\Requests\Legal;

use App\Domain\Legal\Services\LegalConsentCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Re-aceptación de documentos actualizados (o primera aceptación de una
 * cuenta creada antes de que existiera este sistema). El cliente solo manda
 * QUÉ acepta — la versión y la fecha las pone el servidor. No hay campos
 * para editar/borrar una aceptación previa: el registro es append-only.
 */
class AcceptConsentsRequest extends FormRequest
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
        $catalog = app(LegalConsentCatalog::class);

        $rules = [
            'consents' => ['required', 'array', 'min:1'],
            'consents.*' => ['required', 'string', 'distinct', Rule::in($catalog->consentTypes())],
            'legal_versions' => ['sometimes', 'array'],
        ];

        foreach ($catalog->consentTypes() as $type) {
            $rules["legal_versions.{$type}"] = ['sometimes', 'string', Rule::in([$catalog->currentVersionFor($type)])];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'consents.required' => 'Debes aceptar al menos un documento.',
            'consents.*.in' => 'Tipo de consentimiento no válido.',
            'legal_versions.*.in' => 'Uno de los documentos legales fue actualizado. Recarga la página para revisar la versión vigente.',
        ];
    }
}
