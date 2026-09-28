<?php

namespace App\Http\Requests\Concerns;

use App\Domain\Legal\Services\LegalConsentCatalog;
use Illuminate\Validation\Rule;

/**
 * Reglas compartidas por los endpoints que registran consentimientos
 * (registro, login social que crea cuenta). Un campo `accept_<tipo>` por
 * cada consentimiento de config/legal.php — casillas separadas, no una sola.
 *
 * `legal_versions.<tipo>` es opcional: si el cliente lo manda (la versión
 * del texto que le mostró al usuario) tiene que coincidir con la vigente —
 * evita registrar como aceptada una versión que el usuario nunca vio (ej. una
 * pestaña abierta desde antes de publicar una versión nueva). La versión que
 * se GUARDA siempre sale del servidor, nunca de este campo.
 */
trait ValidatesLegalConsents
{
    /**
     * @return array<string, mixed>
     */
    protected function legalConsentRules(bool $required): array
    {
        $catalog = app(LegalConsentCatalog::class);
        $rules = ['legal_versions' => ['sometimes', 'array']];

        foreach ($catalog->consentTypes() as $type) {
            $rules["accept_{$type}"] = $required ? ['required', 'accepted'] : ['sometimes', 'boolean'];
            $rules["legal_versions.{$type}"] = ['sometimes', 'string', Rule::in([$catalog->currentVersionFor($type)])];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    protected function legalConsentMessages(): array
    {
        return [
            'accept_terms.required' => 'Debes aceptar los Términos y Condiciones.',
            'accept_terms.accepted' => 'Debes aceptar los Términos y Condiciones.',
            'accept_privacy.required' => 'Debes aceptar la Política de Privacidad.',
            'accept_privacy.accepted' => 'Debes aceptar la Política de Privacidad.',
            'accept_health_data.required' => 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
            'accept_health_data.accepted' => 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
            'legal_versions.*.in' => 'Uno de los documentos legales fue actualizado. Recarga la página para revisar la versión vigente.',
        ];
    }
}
