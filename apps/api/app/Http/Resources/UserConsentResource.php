<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo UserConsent (consentimiento) para tipar el resource.
use App\Models\UserConsent;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin UserConsent */
// Esta línea sirve para declarar el resource que da formato a un consentimiento.
class UserConsentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el consentimiento en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el tipo de consentimiento.
            'consent_type' => $this->consent_type,
            // Esta línea sirve para incluir la versión del documento.
            'document_version' => $this->document_version,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir el origen del registro.
            'source' => $this->source,
            // Esta línea sirve para incluir cuándo se registró, en formato ISO 8601.
            'recorded_at' => $this->recorded_at?->toIso8601String(),
        ];
    }
}
