<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo ChallengeTemplate (plantilla de reto) para tipar el resource.
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChallengeTemplate */
// Esta línea sirve para declarar el resource que da formato a una plantilla de reto para el admin.
class AdminChallengeTemplateResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la plantilla en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el código.
            'code' => $this->code,
            // Esta línea sirve para incluir el título.
            'title' => $this->title,
            // Esta línea sirve para incluir la descripción.
            'description' => $this->description,
            // Esta línea sirve para incluir el tipo (semanal o mensual).
            'type' => $this->type,
            // Esta línea sirve para incluir la métrica.
            'metric' => $this->metric,
            // Esta línea sirve para incluir la meta.
            'target' => $this->target,
            // Esta línea sirve para indicar si está activa.
            'is_active' => $this->is_active,
            // Esta línea sirve para incluir la fecha de creación en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
