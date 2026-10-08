<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el catálogo de tipos y métricas de retos.
use App\Domain\Challenges\Services\ChallengeCatalog;
// Esta línea sirve para importar el modelo ChallengeTemplate (plantilla de reto).
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;

/**
 * Migra las 2 plantillas que antes vivían hardcodeadas en
 * ChallengeCatalog::templates() (ahora retirado) a la tabla editable
 * challenge_templates — mismos code/title/metric/target de siempre, para
 * que GenerateChallengesAction siga generando las mismas instancias
 * semanales/mensuales sin duplicar nada ya creado.
 */
// Esta línea sirve para declarar el seeder que carga las plantillas de retos.
class ChallengeTemplateSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para definir las plantillas a cargar.
        $templates = [
            [
                // Esta línea sirve para definir el código del reto semanal.
                'code' => 'weekly_5_sessions',
                // Esta línea sirve para definir su título.
                'title' => 'Racha semanal',
                // Esta línea sirve para definir su descripción.
                'description' => 'Completa 5 entrenamientos esta semana.',
                // Esta línea sirve para marcarlo como semanal.
                'type' => ChallengeCatalog::TYPE_WEEKLY,
                // Esta línea sirve para medir la cantidad de entrenamientos.
                'metric' => ChallengeCatalog::METRIC_WORKOUTS_COUNT,
                // Esta línea sirve para fijar la meta en 5.
                'target' => 5,
            ],
            [
                // Esta línea sirve para definir el código del reto mensual.
                'code' => 'monthly_volume_10000',
                // Esta línea sirve para definir su título.
                'title' => 'Tonelaje mensual',
                // Esta línea sirve para definir su descripción.
                'description' => 'Mueve 10.000 kg de volumen total este mes.',
                // Esta línea sirve para marcarlo como mensual.
                'type' => ChallengeCatalog::TYPE_MONTHLY,
                // Esta línea sirve para medir el volumen total en kilos.
                'metric' => ChallengeCatalog::METRIC_TOTAL_VOLUME_KG,
                // Esta línea sirve para fijar la meta en 10.000.
                'target' => 10000,
            ],
        ];

        // Esta línea sirve para recorrer las plantillas.
        foreach ($templates as $template) {
            // Esta línea sirve para crear la plantilla, o actualizarla si ya existía, buscándola por su código.
            ChallengeTemplate::query()->updateOrCreate(['code' => $template['code']], $template);
        }
    }
}
