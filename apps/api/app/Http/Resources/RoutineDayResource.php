<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo RoutineDay (día de rutina) para tipar el resource.
use App\Models\RoutineDay;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineDay */
// Esta línea sirve para declarar el resource que da formato a un día de rutina.
class RoutineDayResource extends JsonResource
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
            // Esta línea sirve para incluir los grupos musculares del día.
            'target_muscle_groups' => $this->target_muscle_groups,
            // Esta línea sirve para incluir los ejercicios solo si se cargaron.
            'exercises' => RoutineExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
