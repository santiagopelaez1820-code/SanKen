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
// Esta línea sirve para declarar el resource que da formato a un usuario para el admin.
class AdminUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte el usuario en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir el nombre.
            'name' => $this->name,
            // Esta línea sirve para incluir el correo.
            'email' => $this->email,
            // Esta línea sirve para incluir el rol.
            'role' => $this->role,
            // Esta línea sirve para indicar si está baneado.
            'is_banned' => $this->is_banned,
            // Esta línea sirve para indicar si desactivó su cuenta.
            'is_deactivated' => $this->deactivated_at !== null,
            // Esta línea sirve para incluir el país de su ciudad (o null).
            'country' => $this->profile?->city?->country?->name,
            // Esta línea sirve para incluir el departamento/estado de su ciudad (o null).
            'state' => $this->profile?->city?->state?->name,
            // Esta línea sirve para incluir el nombre de su ciudad (o null).
            'city' => $this->profile?->city?->name,
            // Esta línea sirve para incluir cuándo se verificó como entrenador, en formato ISO 8601.
            'trainer_verified_at' => $this->trainer_verified_at?->toIso8601String(),
            // Esta línea sirve para incluir su última actividad en formato ISO 8601.
            'last_active_at' => $this->last_active_at?->toIso8601String(),
            // Esta línea sirve para incluir la fecha de registro en formato ISO 8601.
            'created_at' => $this->created_at->toIso8601String(),
            // Esta línea sirve para incluir el resumen de su rutina actual.
            'current_routine' => $this->currentRoutineSummary(),
        ];
    }

    /**
     * @return array{id: int, source: string, frequency_days: int, label: string}|null
     */
    // Esta línea sirve para declarar el método privado que arma el resumen de la rutina activa.
    private function currentRoutineSummary(): ?array
    {
        // Esta línea sirve para revisar si las rutinas ya están cargadas para buscar la activa.
        $active = $this->relationLoaded('routines')
            // Esta línea sirve para tomar la activa de las rutinas ya cargadas.
            ? $this->routines->firstWhere('is_active', true)
            // Esta línea sirve para consultar la activa en la base de datos si no estaban cargadas.
            : $this->routines()->where('is_active', true)->first();

        // Esta línea sirve para revisar si no tiene rutina activa.
        if (! $active) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para devolver el resumen.
        return [
            // Esta línea sirve para incluir el id de la rutina.
            'id' => $active->id,
            // Esta línea sirve para incluir el origen de la rutina.
            'source' => $active->source,
            // Esta línea sirve para incluir la frecuencia semanal.
            'frequency_days' => $active->frequency_days,
            // Esta línea sirve para elegir el texto según el origen.
            'label' => match ($active->source) {
                // Esta línea sirve para mostrar "Personalizada" si la asignó el admin.
                'admin' => 'Personalizada',
                // Esta línea sirve para mostrar "Asignada por entrenador" si la asignó un entrenador.
                'trainer' => 'Asignada por entrenador',
                // Esta línea sirve para mostrar "General N días" en cualquier otro caso.
                default => "General {$active->frequency_days} días",
            },
        ];
    }
}
