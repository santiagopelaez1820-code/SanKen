<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserProfile>
 */
class UserProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'age' => fake()->numberBetween(18, 65),
            'sex' => fake()->randomElement(['male', 'female']),
            'height_cm' => fake()->randomFloat(1, 150, 200),
            'weight_kg' => fake()->randomFloat(1, 50, 110),
            'city_id' => null,
            'gym_id' => null,
            'avatar_url' => null,
            'bio' => null,
        ];
    }
}
