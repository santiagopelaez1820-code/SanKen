<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Exercise (ejercicio) para tipar el resource.
use App\Models\Exercise;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Exercise */
// Esta línea sirve para declarar el resource que da formato a un ejercicio para el admin.
class AdminExerciseResource extends JsonResource
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
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir el id del músculo principal.
            'primary_muscle_id' => $this->primary_muscle_id,
            // Esta línea sirve para incluir el músculo principal.
            'primary_muscle' => [
                // Esta línea sirve para incluir el id del músculo.
                'id' => $this->primaryMuscle->id,
                // Esta línea sirve para incluir el nombre del músculo.
                'name' => $this->primaryMuscle->name,
            ],
            // Esta línea sirve para incluir el equipamiento.
            'equipment' => $this->equipment,
            // Esta línea sirve para incluir el nivel.
            'level' => $this->level,
            // Esta línea sirve para incluir el tipo.
            'type' => $this->type,
            // Esta línea sirve para incluir las instrucciones.
            'instructions' => $this->instructions,
            // Esta línea sirve para incluir los errores comunes.
            'common_mistakes' => $this->common_mistakes,
            // Esta línea sirve para incluir los consejos.
            'tips' => $this->tips,
            // Esta línea sirve para incluir la URL del video.
            'video_url' => $this->video_url,
            // Esta línea sirve para incluir la URL de la imagen.
            'image_url' => $this->image_url,
            // Esta línea sirve para indicar si está activo.
            'is_active' => $this->is_active,
            // Esta línea sirve para incluir las alternativas solo si se cargaron.
            'alternatives' => $this->whenLoaded(
                // Esta línea sirve para indicar la relación que se revisa.
                'alternatives',
                // Esta línea sirve para convertir cada alternativa en su id y nombre.
                fn () => $this->alternatives->map(fn ($alt) => ['id' => $alt->id, 'name' => $alt->name]),
            ),
        ];
    }
}
