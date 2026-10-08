<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo WorkoutSession (sesión de entrenamiento) para tipar el resource.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkoutSession */
// Esta línea sirve para declarar el resource que da formato a una sesión de entrenamiento.
class WorkoutSessionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la sesión en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el id del día de rutina.
            'routine_day_id' => $this->routine_day_id,
            // Esta línea sirve para incluir el nombre del día de rutina.
            'routine_day_label' => $this->routineDay?->label,
            // Esta línea sirve para incluir la fecha del entrenamiento.
            'performed_at' => $this->performed_at?->toDateString(),
            // Esta línea sirve para incluir la duración en minutos.
            'duration_minutes' => $this->duration_minutes,
            // Esta línea sirve para indicar si se completó.
            'completed' => $this->completed,
            // Esta línea sirve para indicar si se hizo como estaba planeado.
            'completed_as_planned' => $this->completed_as_planned,
            // Esta línea sirve para indicar si se saltó.
            'skipped' => $this->skipped_at !== null,
            // Esta línea sirve para indicar si se canceló.
            'cancelled' => $this->cancelled_at !== null,
            // Esta línea sirve para incluir la calidad del sueño.
            'sleep_quality' => $this->sleep_quality,
            // Esta línea sirve para incluir el nivel de energía.
            'energy_level' => $this->energy_level,
            // Esta línea sirve para incluir el dolor muscular.
            'muscle_soreness' => $this->muscle_soreness,
            // Esta línea sirve para indicar si se ajustó la sesión por el precheck.
            'readiness_adjusted' => $this->readiness_adjusted,
            // Esta línea sirve para incluir la nota del ajuste por el precheck.
            'readiness_note' => $this->readiness_note,
            // Esta línea sirve para incluir las notas.
            'notes' => $this->notes,
            // Esta línea sirve para incluir los ejercicios solo si se cargaron.
            'exercises' => WorkoutExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}
