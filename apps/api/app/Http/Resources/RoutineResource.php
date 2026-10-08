<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Routine (rutina) para tipar el resource.
use App\Models\Routine;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Routine */
// Esta línea sirve para declarar el resource que da formato a una rutina.
class RoutineResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la rutina en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el origen de la rutina (general, entrenador o admin).
            'source' => $this->source,
            // Esta línea sirve para incluir el objetivo.
            'goal' => $this->goal,
            // Esta línea sirve para incluir el tipo de división.
            'split_type' => $this->split_type,
            // Esta línea sirve para incluir la frecuencia semanal.
            'frequency_days' => $this->frequency_days,
            // Esta línea sirve para incluir la duración en semanas.
            'duration_weeks' => $this->duration_weeks,
            // Esta línea sirve para indicar si está activa.
            'is_active' => $this->is_active,
            // Esta línea sirve para incluir la fecha de inicio.
            'starts_at' => $this->starts_at?->toDateString(),
            // Esta línea sirve para incluir la fecha de fin.
            'ends_at' => $this->ends_at?->toDateString(),
            // Esta línea sirve para incluir los días solo si se cargaron.
            'days' => RoutineDayResource::collection($this->whenLoaded('days')),
        ];
    }
}
