<?php

namespace Database\Seeders;

use App\Models\MuscleGroup;
use Illuminate\Database\Seeder;

class MuscleGroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['slug' => 'chest', 'name' => 'Pecho'],
            ['slug' => 'back', 'name' => 'Espalda'],
            ['slug' => 'shoulders', 'name' => 'Hombros'],
            ['slug' => 'biceps', 'name' => 'Bíceps'],
            ['slug' => 'triceps', 'name' => 'Tríceps'],
            ['slug' => 'quads', 'name' => 'Cuádriceps'],
            ['slug' => 'hamstrings', 'name' => 'Isquiotibiales'],
            ['slug' => 'glutes', 'name' => 'Glúteos'],
            ['slug' => 'core', 'name' => 'Core'],
            ['slug' => 'calves', 'name' => 'Pantorrillas'],
        ];

        foreach ($groups as $group) {
            MuscleGroup::query()->updateOrCreate(['slug' => $group['slug']], ['name' => $group['name']]);
        }
    }
}
