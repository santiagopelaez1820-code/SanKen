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
// Esta línea sirve para declarar el resource que da formato a un ejercicio del catálogo.
class ExerciseCatalogResource extends JsonResource
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
            // Esta línea sirve para incluir el músculo principal.
            'primary_muscle' => [
                // Esta línea sirve para incluir el id del músculo.
                'id' => $this->primaryMuscle->id,
                // Esta línea sirve para incluir el nombre del músculo.
                'name' => $this->primaryMuscle->name,
                // Esta línea sirve para incluir el slug del músculo.
                'slug' => $this->primaryMuscle->slug,
            ],
            // Esta línea sirve para incluir el equipamiento.
            'equipment' => $this->equipment,
            // Esta línea sirve para incluir el nivel.
            'level' => $this->level,
            // Esta línea sirve para incluir el tipo.
            'type' => $this->type,
        ];
    }
}
