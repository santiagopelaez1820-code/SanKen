<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el modelo MuscleGroup (grupo muscular).
use App\Models\MuscleGroup;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

// Esta línea sirve para declarar el seeder que carga los grupos musculares.
class MuscleGroupSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para definir la lista de grupos musculares.
        $groups = [
            // Esta línea sirve para agregar el grupo muscular "Pecho" (slug chest).
            ['slug' => 'chest', 'name' => 'Pecho'],
            // Esta línea sirve para agregar el grupo muscular "Espalda" (slug back).
            ['slug' => 'back', 'name' => 'Espalda'],
            // Esta línea sirve para agregar el grupo muscular "Hombros" (slug shoulders).
            ['slug' => 'shoulders', 'name' => 'Hombros'],
            // Esta línea sirve para agregar el grupo muscular "Bíceps" (slug biceps).
            ['slug' => 'biceps', 'name' => 'Bíceps'],
            // Esta línea sirve para agregar el grupo muscular "Tríceps" (slug triceps).
            ['slug' => 'triceps', 'name' => 'Tríceps'],
            // Esta línea sirve para agregar el grupo muscular "Cuádriceps" (slug quads).
            ['slug' => 'quads', 'name' => 'Cuádriceps'],
            // Esta línea sirve para agregar el grupo muscular "Isquiotibiales" (slug hamstrings).
            ['slug' => 'hamstrings', 'name' => 'Isquiotibiales'],
            // Esta línea sirve para agregar el grupo muscular "Glúteos" (slug glutes).
            ['slug' => 'glutes', 'name' => 'Glúteos'],
            // Esta línea sirve para agregar el grupo muscular "Core" (slug core).
            ['slug' => 'core', 'name' => 'Core'],
            // Esta línea sirve para agregar el grupo muscular "Pantorrillas" (slug calves).
            ['slug' => 'calves', 'name' => 'Pantorrillas'],
        ];

        // Esta línea sirve para recorrer cada grupo muscular.
        foreach ($groups as $group) {
            // Esta línea sirve para crear el grupo, o actualizar su nombre si ya existía, buscándolo por slug.
            MuscleGroup::query()->updateOrCreate(['slug' => $group['slug']], ['name' => $group['name']]);
        }
    }
}
