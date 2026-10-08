<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar el modelo City (ciudad).
use App\Models\City;
// Esta línea sirve para importar el modelo Gym (gimnasio).
use App\Models\Gym;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Gym>
 */
// Esta línea sirve para declarar la factory que crea gimnasios de prueba.
class GymFactory extends Factory
{
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para usar un nombre de empresa falso seguido de "Gym".
            'name' => fake()->company().' Gym',
            // Esta línea sirve para crear una ciudad para el gimnasio.
            'city_id' => City::factory(),
            // Esta línea sirve para usar una dirección falsa.
            'address' => fake()->streetAddress(),
            // Esta línea sirve para marcarlo como verificado.
            'verified' => true,
        ];
    }
}
