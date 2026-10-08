<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Report (reporte) para tipar el resource.
use App\Models\Report;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Report */
// Esta línea sirve para declarar el resource que da formato a un reporte.
class ReportResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el reporte en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir quién hizo el reporte.
            'reporter' => [
                // Esta línea sirve para incluir el id de quien reportó.
                'id' => $this->reporter->id,
                // Esta línea sirve para incluir el nombre de quien reportó.
                'name' => $this->reporter->name,
            ],
            // Esta línea sirve para incluir el tipo de contenido reportado.
            'reportable_type' => $this->reportable_type,
            // Esta línea sirve para incluir el id del contenido reportado.
            'reportable_id' => $this->reportable_id,
            // Esta línea sirve para incluir una vista previa del contenido solo en ciertos casos.
            'reportable_preview' => $this->when(
                // Esta línea sirve para mostrarla solo si es un mensaje de chat que todavía existe.
                $this->reportable_type === 'chat_message' && $this->reportable,
                // Esta línea sirve para usar el texto del mensaje como vista previa.
                fn () => $this->reportable?->body,
            ),
            // Esta línea sirve para incluir el motivo.
            'reason' => $this->reason,
            // Esta línea sirve para incluir los detalles.
            'details' => $this->details,
            // Esta línea sirve para incluir el estado.
            'status' => $this->status,
            // Esta línea sirve para incluir quién lo resolvió solo si ya fue resuelto.
            'resolved_by' => $this->when($this->resolved_by, fn () => [
                // Esta línea sirve para incluir el id de quien lo resolvió.
                'id' => $this->resolver->id,
                // Esta línea sirve para incluir el nombre de quien lo resolvió.
                'name' => $this->resolver->name,
            ]),
            // Esta línea sirve para incluir cuándo se resolvió, en formato ISO 8601.
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            // Esta línea sirve para incluir las notas de la resolución.
            'resolution_notes' => $this->resolution_notes,
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
