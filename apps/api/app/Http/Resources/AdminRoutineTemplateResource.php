<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina) para tipar el resource.
use App\Models\RoutineTemplate;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplate */
// Esta línea sirve para declarar el resource que da formato a una plantilla de rutina para el admin.
class AdminRoutineTemplateResource extends JsonResource
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
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir el sexo.
            'sex' => $this->sex,
            // Esta línea sirve para incluir la frecuencia semanal.
            'frequency_days' => $this->frequency_days,
            // Esta línea sirve para incluir el nivel.
            'level' => $this->level,
            // Esta línea sirve para incluir el tipo de división.
            'split_type' => $this->split_type,
            // Esta línea sirve para indicar si está activa.
            'is_active' => $this->is_active,
            // Esta línea sirve para incluir los días solo si se cargaron.
            'days' => AdminRoutineTemplateDayResource::collection($this->whenLoaded('days')),
        ];
    }
}
