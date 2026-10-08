<?php

// Esta línea sirve para ubicar este trait en el espacio de nombres de utilidades compartidas de las validaciones.

namespace App\Http\Requests\Concerns;

// Esta línea sirve para importar el catálogo de documentos y consentimientos legales.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar Rule para reglas de validación avanzadas.
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
// Esta línea sirve para declarar el trait con las reglas compartidas de consentimientos legales.
trait ValidatesLegalConsents
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que arma las reglas de los consentimientos.
    protected function legalConsentRules(bool $required): array
    {
        // Esta línea sirve para obtener el catálogo legal del contenedor de Laravel.
        $catalog = app(LegalConsentCatalog::class);
        // Esta línea sirve para permitir opcionalmente la lista de versiones que vio el usuario.
        $rules = ['legal_versions' => ['sometimes', 'array']];

        // Esta línea sirve para recorrer cada tipo de consentimiento.
        foreach ($catalog->consentTypes() as $type) {
            // Esta línea sirve para exigir la casilla aceptada si es obligatoria, o aceptar un booleano opcional si no.
            $rules["accept_{$type}"] = $required ? ['required', 'accepted'] : ['sometimes', 'boolean'];
            // Esta línea sirve para exigir que la versión enviada, si viene, sea la vigente.
            $rules["legal_versions.{$type}"] = ['sometimes', 'string', Rule::in([$catalog->currentVersionFor($type)])];
        }

        // Esta línea sirve para devolver las reglas.
        return $rules;
    }

    /**
     * @return array<string, string>
     */
    // Esta línea sirve para declarar el método que arma los mensajes de error de los consentimientos.
    protected function legalConsentMessages(): array
    {
        // Esta línea sirve para devolver los mensajes.
        return [
            // Esta línea sirve para definir el mensaje si falta aceptar los Términos.
            'accept_terms.required' => 'Debes aceptar los Términos y Condiciones.',
            // Esta línea sirve para definir el mensaje si no se aceptaron los Términos.
            'accept_terms.accepted' => 'Debes aceptar los Términos y Condiciones.',
            // Esta línea sirve para definir el mensaje si falta aceptar la Política de Privacidad.
            'accept_privacy.required' => 'Debes aceptar la Política de Privacidad.',
            // Esta línea sirve para definir el mensaje si no se aceptó la Política de Privacidad.
            'accept_privacy.accepted' => 'Debes aceptar la Política de Privacidad.',
            // Esta línea sirve para definir el mensaje si falta autorizar los datos de salud.
            'accept_health_data.required' => 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
            // Esta línea sirve para definir el mensaje si no se autorizaron los datos de salud.
            'accept_health_data.accepted' => 'Debes autorizar el tratamiento de tus datos de salud y condición física.',
            // Esta línea sirve para definir el mensaje si la versión enviada ya no es la vigente.
            'legal_versions.*.in' => 'Uno de los documentos legales fue actualizado. Recarga la página para revisar la versión vigente.',
        ];
    }
}
