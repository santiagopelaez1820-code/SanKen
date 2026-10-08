<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones legales.

namespace App\Application\Legal\Actions;

// Esta línea sirve para importar el catálogo de consentimientos legales vigentes.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent (consentimiento registrado).
use App\Models\UserConsent;

// Esta línea sirve para declarar la acción que registra los consentimientos aceptados por un usuario.
class RecordUserConsentsAction
{
    // Esta línea sirve para declarar el constructor que recibe sus dependencias.
    public function __construct(
        // Esta línea sirve para recibir y guardar el catálogo de consentimientos.
        private readonly LegalConsentCatalog $catalog,
    ) {}

    /**
     * Registra la aceptación de cada tipo en la versión VIGENTE según el
     * servidor — el cliente solo dice "acepto X", nunca qué versión ni en
     * qué fecha. Idempotente: re-aceptar la misma versión no duplica filas
     * (firstOrCreate sobre el índice único).
     *
     * @param  list<string>  $consentTypes
     */
    // Esta línea sirve para declarar el método que recibe al usuario, los tipos aceptados y el origen.
    public function execute(User $user, array $consentTypes, string $source): void
    {
        // Esta línea sirve para guardar la fecha y hora actual.
        $now = now();

        // Esta línea sirve para recorrer cada tipo de consentimiento sin repetidos.
        foreach (array_unique($consentTypes) as $type) {
            // Esta línea sirve para buscar el consentimiento o crearlo si no existe (no duplica).
            UserConsent::query()->firstOrCreate(
                [
                    // Esta línea sirve para buscar por el id del usuario.
                    'user_id' => $user->id,
                    // Esta línea sirve para buscar por el tipo de consentimiento.
                    'consent_type' => $type,
                    // Esta línea sirve para buscar por la versión vigente del documento según el servidor.
                    'document_version' => $this->catalog->currentVersionFor($type),
                    // Esta línea sirve para buscar por el estado aceptado.
                    'status' => UserConsent::STATUS_ACCEPTED,
                ],
                [
                    // Esta línea sirve para guardar, al crearlo, desde dónde se aceptó (registro, re-aceptación...).
                    'source' => $source,
                    // Esta línea sirve para guardar, al crearlo, la fecha de aceptación.
                    'recorded_at' => $now,
                ],
            );
        }
    }
}
