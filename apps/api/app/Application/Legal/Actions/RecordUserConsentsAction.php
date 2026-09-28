<?php

namespace App\Application\Legal\Actions;

use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Models\User;
use App\Models\UserConsent;

class RecordUserConsentsAction
{
    public function __construct(
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
    public function execute(User $user, array $consentTypes, string $source): void
    {
        $now = now();

        foreach (array_unique($consentTypes) as $type) {
            UserConsent::query()->firstOrCreate(
                [
                    'user_id' => $user->id,
                    'consent_type' => $type,
                    'document_version' => $this->catalog->currentVersionFor($type),
                    'status' => UserConsent::STATUS_ACCEPTED,
                ],
                [
                    'source' => $source,
                    'recorded_at' => $now,
                ],
            );
        }
    }
}
