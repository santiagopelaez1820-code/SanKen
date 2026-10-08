<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las validaciones legales.

namespace App\Http\Requests\Legal;

// Esta línea sirve para importar el catálogo de documentos y consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar la clase base de validación de formularios.
use Illuminate\Foundation\Http\FormRequest;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
use Illuminate\Validation\Rule;

/**
 * Re-aceptación de documentos actualizados (o primera aceptación de una
 * cuenta creada antes de que existiera este sistema). El cliente solo manda
 * QUÉ acepta — la versión y la fecha las pone el servidor. No hay campos
 * para editar/borrar una aceptación previa: el registro es append-only.
 */
// Esta línea sirve para declarar la validación de la aceptación de documentos legales.
class AcceptConsentsRequest extends FormRequest
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
        // Esta línea sirve para obtener el catálogo legal del contenedor de Laravel.
        $catalog = app(LegalConsentCatalog::class);

        // Esta línea sirve para armar las reglas base.
        $rules = [
            // Esta línea sirve para exigir una lista con al menos un consentimiento.
            'consents' => ['required', 'array', 'min:1'],
            // Esta línea sirve para exigir que cada consentimiento sea un tipo válido y sin repetir.
            'consents.*' => ['required', 'string', 'distinct', Rule::in($catalog->consentTypes())],
            // Esta línea sirve para permitir opcionalmente la lista de versiones que vio el usuario.
            'legal_versions' => ['sometimes', 'array'],
        ];

        // Esta línea sirve para recorrer cada tipo de consentimiento.
        foreach ($catalog->consentTypes() as $type) {
            // Esta línea sirve para exigir que la versión enviada, si viene, sea la vigente.
            $rules["legal_versions.{$type}"] = ['sometimes', 'string', Rule::in([$catalog->currentVersionFor($type)])];
        }

        // Esta línea sirve para devolver las reglas.
        return $rules;
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar los mensajes de error personalizados.
    public function messages(): array
    {
        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si no se envió ningún consentimiento.
            'consents.required' => 'Debes aceptar al menos un documento.',
            // Esta línea sirve para definir el mensaje si un tipo de consentimiento no es válido.
            'consents.*.in' => 'Tipo de consentimiento no válido.',
            // Esta línea sirve para definir el mensaje si la versión enviada ya no es la vigente.
            'legal_versions.*.in' => 'Uno de los documentos legales fue actualizado. Recarga la página para revisar la versión vigente.',
        ];
    }
}
