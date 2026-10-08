<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo RoutineExercise (ejercicio de un día de rutina) para tipar el resource.
use App\Models\RoutineExercise;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoutineExercise */
// Esta línea sirve para declarar el resource que da formato a un ejercicio de la rutina.
class RoutineExerciseResource extends JsonResource
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
                // Esta línea sirve para incluir la URL del video.
                'video_url' => $this->exercise->video_url,
                // Esta línea sirve para incluir la URL de la imagen.
                'image_url' => $this->exercise->image_url,
            ],
            // Presente solo si el ejercicio tiene una alternativa A/B sembrada
            // (ver RoutineTemplateSeeder / exercise_alternatives) — el
            // frontend usa esto para decidir si mostrar "Cambiar ejercicio".
            // Esta línea sirve para incluir la alternativa si las alternativas se cargaron.
            'alternative' => $this->exercise->relationLoaded('alternatives')
                // Esta línea sirve para resumir la primera alternativa.
                ? self::summarize($this->exercise->alternatives->first())
                // Esta línea sirve para usar null si no se cargaron.
                : null,
            // Esta línea sirve para incluir las series objetivo.
            'target_sets' => $this->target_sets,
            // Esta línea sirve para incluir las repeticiones objetivo.
            'target_reps' => $this->target_reps,
            // Esta línea sirve para incluir el descanso en segundos.
            'rest_seconds' => $this->rest_seconds,
            // Esta línea sirve para incluir el RPE objetivo.
            'target_rpe' => $this->target_rpe,
            // Esta línea sirve para incluir el peso sugerido por la sobrecarga progresiva.
            'suggested_weight_kg' => $this->suggested_weight_kg,
            // Esta línea sirve para incluir las repeticiones sugeridas por serie.
            'suggested_reps_per_set' => $this->suggested_reps_per_set,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    // Esta línea sirve para declarar el método que resume un ejercicio (o devuelve null).
    public static function summarize(?Exercise $exercise): ?array
    {
        // Esta línea sirve para revisar si no hay ejercicio.
        if (! $exercise) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para devolver el resumen.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $exercise->id,
            // Esta línea sirve para incluir el nombre.
            'name' => $exercise->name,
            // Esta línea sirve para incluir el nombre del músculo principal.
            'primary_muscle' => $exercise->primaryMuscle->name,
            // Esta línea sirve para incluir el equipamiento.
            'equipment' => $exercise->equipment,
            // Esta línea sirve para incluir la URL del video.
            'video_url' => $exercise->video_url,
            // Esta línea sirve para incluir la URL de la imagen.
            'image_url' => $exercise->image_url,
        ];
    }
}
