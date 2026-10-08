<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los resources.

namespace App\Http\Resources;

// Esta línea sirve para importar el modelo BodyMeasurement (medida corporal) para tipar el resource.
use App\Models\BodyMeasurement;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;
// Esta línea sirve para importar la clase base de los resources JSON.
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BodyMeasurement */
// Esta línea sirve para declarar el resource que da formato a una medida corporal.
class BodyMeasurementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    // Esta línea sirve para declarar el método que convierte la medida en arreglo para la respuesta JSON.
    public function toArray(Request $request): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para incluir el id.
            'id' => $this->id,
            // Esta línea sirve para incluir la fecha de la medición.
            'measured_at' => $this->measured_at?->toDateString(),
            // Esta línea sirve para incluir el peso como número decimal (o null).
            'weight_kg' => $this->weight_kg !== null ? (float) $this->weight_kg : null,
            // Esta línea sirve para incluir el porcentaje de grasa como número decimal (o null).
            'body_fat_pct' => $this->body_fat_pct !== null ? (float) $this->body_fat_pct : null,
            // Esta línea sirve para incluir el pecho como número decimal (o null).
            'chest_cm' => $this->chest_cm !== null ? (float) $this->chest_cm : null,
            // Esta línea sirve para incluir la cintura como número decimal (o null).
            'waist_cm' => $this->waist_cm !== null ? (float) $this->waist_cm : null,
            // Esta línea sirve para incluir la cadera como número decimal (o null).
            'hip_cm' => $this->hip_cm !== null ? (float) $this->hip_cm : null,
            // Esta línea sirve para incluir el brazo como número decimal (o null).
            'arm_cm' => $this->arm_cm !== null ? (float) $this->arm_cm : null,
            // Esta línea sirve para incluir el muslo como número decimal (o null).
            'thigh_cm' => $this->thigh_cm !== null ? (float) $this->thigh_cm : null,
            // Esta línea sirve para incluir la URL de la foto de progreso.
            'progress_photo_url' => $this->progress_photo_url,
        ];
    }
}
