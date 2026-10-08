<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de progreso.

namespace App\Application\Progress\Actions;

// Esta línea sirve para importar el modelo BodyMeasurement (medida corporal).
use App\Models\BodyMeasurement;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la acción que registra una medida corporal.
class RecordBodyMeasurementAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe al usuario y los datos de la medida.
    public function execute(User $user, array $data): BodyMeasurement
    {
        // Esta línea sirve para crear la medida corporal asociada al usuario y devolverla.
        return $user->bodyMeasurements()->create([
            // Esta línea sirve para copiar todos los datos recibidos.
            ...$data,
            // Esta línea sirve para usar la fecha enviada, o la de hoy si no se envió.
            'measured_at' => $data['measured_at'] ?? now()->toDateString(),
        ]);
    }
}
