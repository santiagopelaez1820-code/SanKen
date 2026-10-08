<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar el modelo State (departamento o estado).
use App\Models\State;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<State>
 */
// Esta línea sirve para declarar la factory que crea estados de prueba.
class StateFactory extends Factory
{
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para crear un país para el estado.
            'country_id' => Country::factory(),
            // Esta línea sirve para usar un nombre de estado falso.
            'name' => fake()->state(),
        ];
    }
}
