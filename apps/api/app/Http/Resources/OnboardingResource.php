<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo User (usuario) para tipar el resource.
use App\Models\User;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
// Esta línea sirve para declarar el resource que da formato a las respuestas del onboarding.
class OnboardingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte los datos en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para obtener el perfil del usuario.
        $profile = $this->profile;
        // Esta línea sirve para obtener las respuestas del onboarding.
        $onboarding = $this->onboardingResponse;

        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir la edad.
            'age' => $profile?->age,
            // Esta línea sirve para incluir el sexo.
            'sex' => $profile?->sex,
            // Esta línea sirve para incluir la altura en cm.
            'height_cm' => $profile?->height_cm,
            // Esta línea sirve para incluir el peso en kg.
            'weight_kg' => $profile?->weight_kg,
            // Esta línea sirve para incluir el id de la ciudad.
            'city_id' => $profile?->city_id,
            // Derivados, no columnas propias — igual que en RankingScopeResolver: el
            // perfil solo guarda city_id, país/depto se resuelven hacia arriba.
            // Esta línea sirve para incluir el id del departamento/estado de la ciudad.
            'state_id' => $profile?->city?->state_id,
            // Esta línea sirve para incluir el id del país de la ciudad.
            'country_id' => $profile?->city?->country_id,
            // Esta línea sirve para incluir el id del gimnasio.
            'gym_id' => $profile?->gym_id,

            // Esta línea sirve para incluir el nivel.
            'level' => $onboarding?->level,
            // Esta línea sirve para incluir los objetivos (lista vacía si no hay).
            'goals' => $onboarding?->goals ?? [],
            // Esta línea sirve para incluir la frecuencia semanal.
            'frequency_days' => $onboarding?->frequency_days,
            // Esta línea sirve para incluir el equipamiento disponible (lista vacía si no hay).
            'equipment_available' => $onboarding?->equipment_available ?? [],

            // Esta línea sirve para indicar si el onboarding está completo.
            'completed' => (bool) $onboarding?->completed,
            // Esta línea sirve para incluir cuándo se completó, en formato ISO 8601.
            'completed_at' => $onboarding?->completed_at?->toIso8601String(),
        ];
    }
}
