<?php

namespace App\Domain\Legal\Services;

use App\Models\User;
use App\Models\UserConsent;
use InvalidArgumentException;

/**
 * Única fuente de verdad (del lado del servidor) sobre qué documentos
 * legales existen, en qué versión están y qué consentimientos tiene
 * pendientes un usuario. Lee config/legal.php.
 */
class LegalConsentCatalog
{
    /**
     * @return array<string, array{version: string, updated_at: string, status: string}>
     */
    public function documents(): array
    {
        return config('legal.documents');
    }

    /**
     * @return list<string>
     */
    public function consentTypes(): array
    {
        return array_keys(config('legal.consents'));
    }

    public function documentFor(string $consentType): string
    {
        $consent = config("legal.consents.{$consentType}");

        if (! $consent) {
            throw new InvalidArgumentException("Tipo de consentimiento desconocido: {$consentType}");
        }

        return $consent['document'];
    }

    public function currentVersionFor(string $consentType): string
    {
        return config('legal.documents.'.$this->documentFor($consentType).'.version');
    }

    /**
     * Consentimientos que el usuario todavía no otorgó en la versión vigente
     * de su documento: nunca los aceptó, o aceptó una versión anterior.
     *
     * @return list<array{type: string, document: string, version: string, accepted_version: ?string}>
     */
    public function pendingFor(User $user): array
    {
        // Orden cronológico (recorded_at, luego id para filas del mismo
        // segundo) — así la última de cada tipo es la aceptación más reciente.
        // Nunca se comparan strings de versión como si fueran números.
        $accepted = $user->consents()
            ->where('status', UserConsent::STATUS_ACCEPTED)
            ->orderBy('recorded_at')
            ->orderBy('id')
            ->get(['consent_type', 'document_version']);

        $pending = [];

        foreach ($this->consentTypes() as $type) {
            $current = $this->currentVersionFor($type);
            $ofType = $accepted->where('consent_type', $type);

            if (! $ofType->contains('document_version', $current)) {
                $pending[] = [
                    'type' => $type,
                    'document' => $this->documentFor($type),
                    'version' => $current,
                    'accepted_version' => $ofType->last()?->document_version,
                ];
            }
        }

        return $pending;
    }

    /**
     * @return list<string>
     */
    public function pendingTypesFor(User $user): array
    {
        return array_column($this->pendingFor($user), 'type');
    }
}
