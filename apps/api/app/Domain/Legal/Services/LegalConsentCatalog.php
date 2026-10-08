<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios legales.

namespace App\Domain\Legal\Services;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent (consentimiento registrado).
use App\Models\UserConsent;
// Esta línea sirve para importar la excepción para tipos de consentimiento desconocidos.
use InvalidArgumentException;

/**
 * Única fuente de verdad (del lado del servidor) sobre qué documentos
 * legales existen, en qué versión están y qué consentimientos tiene
 * pendientes un usuario. Lee config/legal.php.
 */
// Esta línea sirve para declarar el catálogo de documentos legales y consentimientos.
class LegalConsentCatalog
{
    /**
     * @return array<string, array{version: string, updated_at: string, status: string}>
     */
    // Esta línea sirve para declarar el método que devuelve los documentos legales vigentes.
    public function documents(): array
    {
        // Esta línea sirve para devolver los documentos definidos en config/legal.php.
        return config('legal.documents');
    }

    /**
     * @return list<string>
     */
    // Esta línea sirve para declarar el método que devuelve los tipos de consentimiento.
    public function consentTypes(): array
    {
        // Esta línea sirve para devolver los nombres de los consentimientos definidos en la configuración.
        return array_keys(config('legal.consents'));
    }

    // Esta línea sirve para declarar el método que indica a qué documento pertenece un consentimiento.
    public function documentFor(string $consentType): string
    {
        // Esta línea sirve para leer la configuración de ese consentimiento.
        $consent = config("legal.consents.{$consentType}");

        // Esta línea sirve para revisar si el consentimiento no existe.
        if (! $consent) {
            // Esta línea sirve para lanzar una excepción indicando que el tipo es desconocido.
            throw new InvalidArgumentException("Tipo de consentimiento desconocido: {$consentType}");
        }

        // Esta línea sirve para devolver el documento asociado.
        return $consent['document'];
    }

    // Esta línea sirve para declarar el método que devuelve la versión vigente de un consentimiento.
    public function currentVersionFor(string $consentType): string
    {
        // Esta línea sirve para devolver la versión del documento asociado al consentimiento.
        return config('legal.documents.'.$this->documentFor($consentType).'.version');
    }

    /**
     * Consentimientos que el usuario todavía no otorgó en la versión vigente
     * de su documento: nunca los aceptó, o aceptó una versión anterior.
     *
     * @return list<array{type: string, document: string, version: string, accepted_version: ?string}>
     */
    // Esta línea sirve para declarar el método que calcula los consentimientos pendientes de un usuario.
    public function pendingFor(User $user): array
    {
        // Orden cronológico (recorded_at, luego id para filas del mismo
        // segundo) — así la última de cada tipo es la aceptación más reciente.
        // Nunca se comparan strings de versión como si fueran números.
        // Esta línea sirve para consultar los consentimientos del usuario.
        $accepted = $user->consents()
            // Esta línea sirve para filtrar solo los aceptados.
            ->where('status', UserConsent::STATUS_ACCEPTED)
            // Esta línea sirve para ordenar por fecha de registro.
            ->orderBy('recorded_at')
            // Esta línea sirve para desempatar por id los del mismo segundo.
            ->orderBy('id')
            // Esta línea sirve para obtener solo el tipo y la versión aceptada.
            ->get(['consent_type', 'document_version']);

        // Esta línea sirve para iniciar la lista de pendientes.
        $pending = [];

        // Esta línea sirve para recorrer cada tipo de consentimiento obligatorio.
        foreach ($this->consentTypes() as $type) {
            // Esta línea sirve para obtener la versión vigente de ese tipo.
            $current = $this->currentVersionFor($type);
            // Esta línea sirve para quedarse con las aceptaciones de ese tipo.
            $ofType = $accepted->where('consent_type', $type);

            // Esta línea sirve para revisar si nunca aceptó la versión vigente.
            if (! $ofType->contains('document_version', $current)) {
                // Esta línea sirve para agregarlo a la lista de pendientes.
                $pending[] = [
                    // Esta línea sirve para incluir el tipo de consentimiento.
                    'type' => $type,
                    // Esta línea sirve para incluir el documento asociado.
                    'document' => $this->documentFor($type),
                    // Esta línea sirve para incluir la versión vigente.
                    'version' => $current,
                    // Esta línea sirve para incluir la última versión que aceptó (o null).
                    'accepted_version' => $ofType->last()?->document_version,
                ];
            }
        }

        // Esta línea sirve para devolver la lista de pendientes.
        return $pending;
    }

    /**
     * @return list<string>
     */
    // Esta línea sirve para declarar el método que devuelve solo los tipos pendientes.
    public function pendingTypesFor(User $user): array
    {
        // Esta línea sirve para extraer el tipo de cada consentimiento pendiente.
        return array_column($this->pendingFor($user), 'type');
    }
}
