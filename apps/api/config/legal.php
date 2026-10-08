<?php

/**
 * Versiones vigentes de los documentos legales y consentimientos que un
 * usuario debe otorgar para usar SanKen. El TEXTO de cada documento vive
 * en packages/core/src/legal/ (compartido por web y mobile); acá vive solo
 * la versión vigente, que es la que el backend registra al aceptar — nunca
 * se confía en una versión enviada por el cliente.
 *
 * Al publicar una versión nueva de un documento:
 *   1) actualizar el texto y LEGAL_VERSIONS en packages/core/src/legal/versions.ts,
 *   2) subir acá la misma `version` y `updated_at`.
 * Todo consentimiento cuyo documento cambió de versión vuelve a quedar
 * pendiente para cada usuario (ver LegalConsentCatalog::pendingFor()), y
 * web/mobile le piden re-aceptarlo antes de seguir usando la app.
 *
 * `status` = 'draft' mientras el contenido no haya sido revisado por el
 * responsable de SanKen / un profesional jurídico. No bloquea nada — es
 * informativo y se muestra en las páginas de cada documento.
 */
// Esta línea sirve para devolver el arreglo de configuración legal.
return [
    // Esta línea sirve para definir los documentos legales vigentes.
    'documents' => [
        // Esta línea sirve para definir la versión vigente de los Términos y Condiciones.
        'terms' => ['version' => '1.0', 'updated_at' => '2026-09-28', 'status' => 'approved'],
        // Esta línea sirve para definir la versión vigente de la Política de Privacidad.
        'privacy' => ['version' => '1.2', 'updated_at' => '2026-09-30', 'status' => 'approved'],
        // Esta línea sirve para definir la versión vigente de la Política de Cookies.
        'cookies' => ['version' => '1.1', 'updated_at' => '2026-09-30', 'status' => 'approved'],
    ],

    /*
     * Consentimientos que el usuario otorga explícitamente, cada uno atado a
     * la versión del documento que lo respalda. Se piden por separado (no
     * una sola casilla genérica): aceptar los Términos, aceptar la Política
     * de Privacidad y autorizar el tratamiento de datos de salud/condición
     * física (peso, medidas, sueño/energía/dolor muscular del pre-check)
     * son finalidades distintas.
     *
     * La Política de Cookies NO figura acá: su consentimiento es por
     * navegador (banner de la web), no por cuenta.
     */
    // Esta línea sirve para definir los consentimientos que se piden al usuario.
    'consents' => [
        // Esta línea sirve para atar la aceptación de los Términos a su documento.
        'terms' => ['document' => 'terms'],
        // Esta línea sirve para atar la aceptación de la Privacidad a su documento.
        'privacy' => ['document' => 'privacy'],
        // Esta línea sirve para atar la autorización de datos de salud a la Política de Privacidad.
        'health_data' => ['document' => 'privacy'],
    ],
];
