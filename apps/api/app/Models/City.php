<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "pertenece a" (BelongsTo).
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de las ciudades.
class City extends Model
{
    // Esta línea sirve para usar las factories para crear ciudades de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['country_id', 'state_id', 'name'];

    // Esta línea sirve para declarar la relación con el país.
    public function country(): BelongsTo
    {
        // Esta línea sirve para definir que la ciudad pertenece a un país.
        return $this->belongsTo(Country::class);
    }

    // Esta línea sirve para declarar la relación con el departamento o estado.
    public function state(): BelongsTo
    {
        // Esta línea sirve para definir que la ciudad pertenece a un departamento o estado.
        return $this->belongsTo(State::class);
    }

    // Esta línea sirve para declarar la relación con los gimnasios de la ciudad.
    public function gyms(): HasMany
    {
        // Esta línea sirve para definir que la ciudad tiene muchos gimnasios.
        return $this->hasMany(Gym::class);
    }
}
