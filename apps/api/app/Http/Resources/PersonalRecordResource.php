<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo PersonalRecord (récord personal) para tipar el resource.
use App\Models\PersonalRecord;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PersonalRecord */
// Esta línea sirve para declarar el resource que da formato a un récord personal.
class PersonalRecordResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el récord en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el id del ejercicio.
            'exercise_id' => $this->exercise_id,
            // Esta línea sirve para incluir el nombre del ejercicio solo si se cargó.
            'exercise_name' => $this->whenLoaded('exercise', fn () => $this->exercise->name),
            // Esta línea sirve para incluir el tipo de récord.
            'record_type' => $this->record_type,
            // Esta línea sirve para incluir el valor como número decimal.
            'value' => (float) $this->value,
            // Esta línea sirve para incluir las repeticiones.
            'reps' => $this->reps,
            // Esta línea sirve para incluir la fecha en que se logró.
            'achieved_at' => $this->achieved_at?->toDateString(),
        ];
    }
}
