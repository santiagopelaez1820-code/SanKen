<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserProfile (perfil).
use App\Models\UserProfile;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserProfile>
 */
// Esta línea sirve para declarar la factory que crea perfiles de prueba.
class UserProfileFactory extends Factory
{
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para crear un usuario para el perfil.
            'user_id' => User::factory(),
            // Esta línea sirve para usar una edad entre 18 y 65.
            'age' => fake()->numberBetween(18, 65),
            // Esta línea sirve para elegir el sexo al azar.
            'sex' => fake()->randomElement(['male', 'female']),
            // Esta línea sirve para usar una altura entre 150 y 200 cm.
            'height_cm' => fake()->randomFloat(1, 150, 200),
            // Esta línea sirve para usar un peso entre 50 y 110 kg.
            'weight_kg' => fake()->randomFloat(1, 50, 110),
            // Esta línea sirve para dejarlo sin ciudad.
            'city_id' => null,
            // Esta línea sirve para dejarlo sin gimnasio.
            'gym_id' => null,
            // Esta línea sirve para dejarlo sin foto.
            'avatar_url' => null,
            // Esta línea sirve para dejarlo sin biografía.
            'bio' => null,
        ];
    }
}
