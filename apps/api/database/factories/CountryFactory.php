<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Country>
 */
// Esta línea sirve para declarar la factory que crea países de prueba.
class CountryFactory extends Factory
{
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para usar un nombre de país falso que no se repita.
            'name' => fake()->unique()->country(),
            // Esta línea sirve para usar un código de país falso que no se repita.
            'code' => fake()->unique()->countryCode(),
        ];
    }
}
