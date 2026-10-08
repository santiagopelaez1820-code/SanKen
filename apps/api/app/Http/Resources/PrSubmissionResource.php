<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo PrSubmission (postulación de PR) para tipar el resource.
use App\Models\PrSubmission;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PrSubmission */
// Esta línea sirve para declarar el resource que da formato a una postulación de PR.
class PrSubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la postulación en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el usuario que postuló.
            'user' => [
                // Esta línea sirve para incluir el id del usuario.
                'id' => $this->user->id,
                // Esta línea sirve para incluir el nombre del usuario.
                'name' => $this->user->name,
            ],
            // Esta línea sirve para incluir el ejercicio.
            'exercise' => [
                // Esta línea sirve para incluir el id del ejercicio.
                'id' => $this->exercise->id,
                // Esta línea sirve para incluir el nombre del ejercicio.
                'name' => $this->exercise->name,
            ],
            // Esta línea sirve para incluir el peso.
            'weight_kg' => $this->weight_kg,
            // Esta línea sirve para incluir las repeticiones.
            'reps' => $this->reps,
            // Esta línea sirve para incluir el 1RM estimado.
            'estimated_1rm' => $this->estimated_1rm,
            // Esta línea sirve para incluir la URL del video de evidencia.
            'video_url' => $this->video_url,
            // Esta línea sirve para incluir el estado (pendiente, aprobada o rechazada).
            'status' => $this->status,
            // Esta línea sirve para incluir quién la revisó solo si ya fue revisada.
            'reviewed_by' => $this->when($this->reviewed_by, fn () => [
                // Esta línea sirve para incluir el id del revisor.
                'id' => $this->reviewer->id,
                // Esta línea sirve para incluir el nombre del revisor.
                'name' => $this->reviewer->name,
            ]),
            // Esta línea sirve para incluir cuándo se revisó, en formato ISO 8601.
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            // Esta línea sirve para incluir el motivo del rechazo.
            'rejection_reason' => $this->rejection_reason,
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
