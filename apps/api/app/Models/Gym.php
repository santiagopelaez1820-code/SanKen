<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Esta línea sirve para declarar el modelo de los gimnasios.
class Gym extends Model
{
    // Esta línea sirve para usar las factories para crear gimnasios de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['name', 'city_id', 'address', 'verified'];

    // Esta línea sirve para declarar las conversiones de tipo de los campos.
    protected function casts(): array
    {
        // Esta línea sirve para devolver las conversiones.
        return [
            // Esta línea sirve para convertir "verificado" a booleano.
            'verified' => 'boolean',
        ];
    }

    // Esta línea sirve para declarar la relación con la ciudad.
    public function city(): BelongsTo
    {
        // Esta línea sirve para definir que el gimnasio pertenece a una ciudad.
        return $this->belongsTo(City::class);
    }
}
