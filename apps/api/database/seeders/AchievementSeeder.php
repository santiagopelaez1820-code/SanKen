<?php

namespace Database\Seeders;

use App\Domain\Gamification\Services\AchievementCatalog;
use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        foreach (AchievementCatalog::definitions() as $definition) {
            Achievement::query()->updateOrCreate(
                ['code' => $definition['code']],
                [
                    'name' => $definition['name'],
                    'description' => $definition['description'],
                    'xp_bonus' => $definition['xp_bonus'],
                ],
            );
        }
    }
}
