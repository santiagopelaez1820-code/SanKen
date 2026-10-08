<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo WorkoutSet (serie) para tipar el resource.
use App\Models\WorkoutSet;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkoutSet */
// Esta línea sirve para declarar el resource que da formato a una serie.
class WorkoutSetResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la serie en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el número de serie.
            'set_number' => $this->set_number,
            // Esta línea sirve para incluir el peso como número decimal.
            'weight_kg' => (float) $this->weight_kg,
            // Esta línea sirve para incluir las repeticiones.
            'reps' => $this->reps,
            // Esta línea sirve para incluir el RPE como número decimal (o null).
            'rpe' => $this->rpe !== null ? (float) $this->rpe : null,
            // Esta línea sirve para indicar si es de calentamiento.
            'is_warmup' => $this->is_warmup,
            // Esta línea sirve para indicar si se completó.
            'completed' => $this->completed,
        ];
    }
}
