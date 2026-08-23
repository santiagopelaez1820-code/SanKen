<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Nivel intermedio país→departamento/estado→ciudad. Colombia recibe
 * departamentos reales (el ejemplo explícito del pedido); el resto de los
 * 194 países recibe un único departamento "Nacional" que agrupa sus
 * ciudades ya sembradas por CountrySeeder — así el selector de depto se
 * auto-completa y se salta visualmente cuando hay uno solo, sin inventar
 * nombres de provincias/estados reales para países que no los pidieron.
 *
 * ESTA ES LA CAPA BASE, NO LA FUENTE DE VERDAD FINAL. Después de correr
 * los seeders normales (`php artisan db:seed`), corré también:
 *
 *     php artisan location:import
 *
 * (ver app/Console/Commands/ImportLocationData.php) — trae departamentos/
 * estados y ciudades REALES para prácticamente todos los países desde
 * dr5hn/countries-states-cities-database, reemplazando el placeholder
 * "Nacional" de acá arriba en la práctica (OnboardingController::states()
 * ya lo oculta apenas hay alternativas reales — ver ese controller). No se
 * corre automáticamente en cada `db:seed` porque pega contra GitHub y
 * tarda varios minutos; es un paso aparte, documentado, re-corrible.
 */
class StateSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedColombia();
        $this->seedNationalPlaceholderForOtherCountries();
    }

    private function seedColombia(): void
    {
        $colombiaId = Country::query()->where('code', 'CO')->value('id');
        if (! $colombiaId) {
            return;
        }

        // department => [cities already seeded by CountrySeeder that belong here, cities to add]
        $departments = [
            'Antioquia' => [
                'existing' => ['Medellín'],
                'new' => ['Bello', 'Envigado', 'Itagüí', 'Rionegro', 'Marinilla', 'Apartadó'],
            ],
            'Cundinamarca' => [
                'existing' => ['Bogotá'],
                'new' => ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá'],
            ],
            'Valle del Cauca' => ['existing' => ['Cali'], 'new' => []],
            'Atlántico' => ['existing' => ['Barranquilla'], 'new' => []],
            'Bolívar' => ['existing' => ['Cartagena'], 'new' => []],
            'Santander' => ['existing' => ['Bucaramanga'], 'new' => []],
            'Risaralda' => ['existing' => ['Pereira'], 'new' => []],
            'Caldas' => ['existing' => ['Manizales'], 'new' => []],
            'Magdalena' => ['existing' => ['Santa Marta'], 'new' => []],
        ];

        foreach ($departments as $departmentName => $cities) {
            $stateId = DB::table('states')->where('country_id', $colombiaId)->where('name', $departmentName)->value('id');
            if (! $stateId) {
                $stateId = DB::table('states')->insertGetId([
                    'country_id' => $colombiaId,
                    'name' => $departmentName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('cities')
                ->where('country_id', $colombiaId)
                ->whereIn('name', $cities['existing'])
                ->update(['state_id' => $stateId]);

            if ($cities['new'] !== []) {
                $rows = array_map(fn (string $city) => [
                    'country_id' => $colombiaId,
                    'state_id' => $stateId,
                    'name' => $city,
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $cities['new']);

                DB::table('cities')->upsert($rows, ['country_id', 'name'], ['state_id', 'updated_at']);
            }
        }
    }

    private function seedNationalPlaceholderForOtherCountries(): void
    {
        $colombiaId = Country::query()->where('code', 'CO')->value('id');

        Country::query()
            ->where('id', '!=', $colombiaId)
            ->select(['id'])
            ->chunkById(50, function ($countries) {
                foreach ($countries as $country) {
                    $stateId = DB::table('states')->where('country_id', $country->id)->where('name', 'Nacional')->value('id');
                    if (! $stateId) {
                        $stateId = DB::table('states')->insertGetId([
                            'country_id' => $country->id,
                            'name' => 'Nacional',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    DB::table('cities')
                        ->where('country_id', $country->id)
                        ->whereNull('state_id')
                        ->update(['state_id' => $stateId]);
                }
            });
    }
}
