<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Gym>
 */
class GymFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Gym',
            'city_id' => City::factory(),
            'address' => fake()->streetAddress(),
            'verified' => true,
        ];
    }
}
