<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo Achievement (logro) para tipar el resource.
use App\Models\Achievement;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Achievement */
// Esta línea sirve para declarar el resource que da formato a un logro.
class AchievementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el logro en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el código del logro.
            'code' => $this->code,
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir la descripción.
            'description' => $this->description,
            // Esta línea sirve para incluir la XP extra que otorga.
            'xp_bonus' => $this->xp_bonus,
            // Esta línea sirve para indicar si el usuario lo desbloqueó (solo si se cargó la tabla intermedia).
            'unlocked' => $this->whenPivotLoaded('user_achievements', fn () => true, false),
            // Esta línea sirve para incluir cuándo lo desbloqueó, en formato ISO 8601 (o null).
            'achieved_at' => $this->whenPivotLoaded('user_achievements', fn () => $this->pivot->achieved_at?->toIso8601String(), null),
        ];
    }
}
