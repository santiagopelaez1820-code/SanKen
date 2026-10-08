<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el trait que desactiva los eventos de los modelos.
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

// Esta línea sirve para declarar el seeder principal de la base de datos.
class DatabaseSeeder extends Seeder
{
    // Esta línea sirve para desactivar los eventos de los modelos mientras se siembra.
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    // Esta línea sirve para declarar el método que ejecuta todos los seeders.
    public function run(): void
    {
        // Esta línea sirve para ejecutar los seeders en orden.
        $this->call([
            // Esta línea sirve para cargar los países y sus ciudades.
            CountrySeeder::class,
            // Esta línea sirve para cargar los departamentos/estados.
            StateSeeder::class,
            // Esta línea sirve para cargar los grupos musculares.
            MuscleGroupSeeder::class,
            // Esta línea sirve para cargar los ejercicios.
            ExerciseSeeder::class,
            // Esta línea sirve para cargar las plantillas de rutina.
            RoutineTemplateSeeder::class,
            // Esta línea sirve para cargar los logros.
            AchievementSeeder::class,
            // Esta línea sirve para cargar las plantillas de retos.
            ChallengeTemplateSeeder::class,
            // Esta línea sirve para cargar los alimentos.
            FoodItemSeeder::class,
            // Esta línea sirve para cargar los productos de la tienda.
            ProductSeeder::class,
        ]);
    }
}
