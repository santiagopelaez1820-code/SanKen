<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo RoutineTemplateDay (día de plantilla) para tipar el resource.
use App\Models\RoutineTemplateDay;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplateDay */
// Esta línea sirve para declarar el resource que da formato a un día de plantilla de rutina para el admin.
class AdminRoutineTemplateDayResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el día en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el orden del día.
            'day_order' => $this->day_order,
            // Esta línea sirve para incluir el nombre del día.
            'label' => $this->label,
            // Esta línea sirve para incluir los ejercicios solo si se cargaron.
            'exercises' => AdminRoutineTemplateExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
