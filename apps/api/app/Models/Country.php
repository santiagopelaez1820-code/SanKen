<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los modelos.

namespace App\Models;

// Esta línea sirve para importar el trait que permite crear registros de prueba con factories.
use Illuminate\Database\Eloquent\Factories\HasFactory;
// Esta línea sirve para importar la clase base de los modelos Eloquent.
use Illuminate\Database\Eloquent\Model;
// Esta línea sirve para importar el tipo de relación "tiene muchos" (HasMany).
use Illuminate\Database\Eloquent\Relations\HasMany;

// Esta línea sirve para declarar el modelo de los países.
class Country extends Model
{
    // Esta línea sirve para usar las factories para crear países de prueba.
    use HasFactory;

    // Esta línea sirve para definir los campos que se pueden asignar en masa.
    protected $fillable = ['name', 'code'];

    // Esta línea sirve para declarar la relación con las ciudades del país.
    public function cities(): HasMany
    {
        // Esta línea sirve para definir que el país tiene muchas ciudades.
        return $this->hasMany(City::class);
    }

    // Esta línea sirve para declarar la relación con los departamentos o estados del país.
    public function states(): HasMany
    {
        // Esta línea sirve para definir que el país tiene muchos departamentos o estados.
        return $this->hasMany(State::class);
    }
}
