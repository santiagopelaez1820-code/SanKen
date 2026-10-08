<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el catálogo de logros.
use App\Domain\Gamification\Services\AchievementCatalog;
// Esta línea sirve para importar el modelo Achievement (logro).
use App\Models\Achievement;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

// Esta línea sirve para declarar el seeder que carga los logros.
class AchievementSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para recorrer las definiciones de logros del catálogo.
        foreach (AchievementCatalog::definitions() as $definition) {
            // Esta línea sirve para crear el logro, o actualizarlo si ya existía.
            Achievement::query()->updateOrCreate(
                // Esta línea sirve para buscarlo por su código.
                ['code' => $definition['code']],
                [
                    // Esta línea sirve para guardar el nombre.
                    'name' => $definition['name'],
                    // Esta línea sirve para guardar la descripción.
                    'description' => $definition['description'],
                    // Esta línea sirve para guardar la XP extra.
                    'xp_bonus' => $definition['xp_bonus'],
                ],
            );
        }
    }
}
