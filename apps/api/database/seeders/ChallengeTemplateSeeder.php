<?php

namespace Database\Seeders;

use App\Domain\Challenges\Services\ChallengeCatalog;
use App\Models\ChallengeTemplate;
use Illuminate\Database\Seeder;

/**
 * Migra las 2 plantillas que antes vivían hardcodeadas en
 * ChallengeCatalog::templates() (ahora retirado) a la tabla editable
 * challenge_templates — mismos code/title/metric/target de siempre, para
 * que GenerateChallengesAction siga generando las mismas instancias
 * semanales/mensuales sin duplicar nada ya creado.
 */
class ChallengeTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'code' => 'weekly_5_sessions',
                'title' => 'Racha semanal',
                'description' => 'Completa 5 entrenamientos esta semana.',
                'type' => ChallengeCatalog::TYPE_WEEKLY,
                'metric' => ChallengeCatalog::METRIC_WORKOUTS_COUNT,
                'target' => 5,
            ],
            [
                'code' => 'monthly_volume_10000',
                'title' => 'Tonelaje mensual',
                'description' => 'Mueve 10.000 kg de volumen total este mes.',
                'type' => ChallengeCatalog::TYPE_MONTHLY,
                'metric' => ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
                'target' => 10000,
            ],
        ];

        foreach ($templates as $template) {
            ChallengeTemplate::query()->updateOrCreate(['code' => $template['code']], $template);
        }
    }
}
