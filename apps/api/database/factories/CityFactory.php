<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar el modelo City (ciudad).
use App\Models\City;
// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<City>
 */
// Esta línea sirve para declarar la factory que crea ciudades de prueba.
class CityFactory extends Factory
{
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para crear un país para la ciudad.
            'country_id' => Country::factory(),
            // Esta línea sirve para usar un nombre de ciudad falso.
            'name' => fake()->city(),
        ];
    }
}
