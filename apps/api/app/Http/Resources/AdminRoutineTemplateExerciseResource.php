<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo RoutineTemplateExercise (ejercicio de plantilla) para tipar el resource.
use App\Models\RoutineTemplateExercise;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineTemplateExercise */
// Esta línea sirve para declarar el resource que da formato a un ejercicio de plantilla de rutina para el admin.
class AdminRoutineTemplateExerciseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el ejercicio en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el orden.
            'order' => $this->order,
            // Esta línea sirve para incluir el id del ejercicio.
            'exercise_id' => $this->exercise_id,
            // Esta línea sirve para incluir los datos del ejercicio.
            'exercise' => [
                // Esta línea sirve para incluir el id del ejercicio.
                'id' => $this->exercise->id,
                // Esta línea sirve para incluir el nombre del ejercicio.
                'name' => $this->exercise->name,
                // Esta línea sirve para incluir el nombre del músculo principal.
                'primary_muscle' => $this->exercise->primaryMuscle->name,
                // Esta línea sirve para incluir el equipamiento.
                'equipment' => $this->exercise->equipment,
            ],
            // Esta línea sirve para incluir las series por defecto.
            'default_sets' => $this->default_sets,
            // Esta línea sirve para incluir las repeticiones por defecto.
            'default_reps' => $this->default_reps,
            // Esta línea sirve para incluir el descanso en segundos.
            'rest_seconds' => $this->rest_seconds,
            // Esta línea sirve para incluir el RPE por defecto como número decimal (o null).
            'default_rpe' => $this->default_rpe !== null ? (float) $this->default_rpe : null,
        ];
    }
}
