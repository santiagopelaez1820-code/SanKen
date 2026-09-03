<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            StateSeeder::class,
            MuscleGroupSeeder::class,
            ExerciseSeeder::class,
            RoutineTemplateSeeder::class,
            AchievementSeeder::class,
            ChallengeTemplateSeeder::class,
            FoodItemSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
