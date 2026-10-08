<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los seeders.

namespace Database\Seeders;

// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar la clase base de los seeders.
use Illuminate\Database\Seeder;
// Esta línea sirve para importar la fachada DB para consultar e insertar en bloque.
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
// Esta línea sirve para declarar el seeder que carga los departamentos/estados.
class StateSeeder extends Seeder
{
    // Esta línea sirve para declarar el método que ejecuta el seeder.
    public function run(): void
    {
        // Esta línea sirve para cargar los departamentos reales de Colombia.
        $this->seedColombia();
        // Esta línea sirve para crear el departamento "Nacional" para los demás países.
        $this->seedNationalPlaceholderForOtherCountries();
    }

    // Esta línea sirve para declarar el método que carga los departamentos de Colombia.
    private function seedColombia(): void
    {
        // Esta línea sirve para obtener el id de Colombia.
        $colombiaId = Country::query()->where('code', 'CO')->value('id');
        // Esta línea sirve para revisar si Colombia no existe todavía.
        if (! $colombiaId) {
            // Esta línea sirve para terminar sin hacer nada.
            return;
        }

        // department => [cities already seeded by CountrySeeder that belong here, cities to add]
        // Esta línea sirve para definir los departamentos con sus ciudades ya existentes y nuevas.
        $departments = [
            // Esta línea sirve para definir Antioquia.
            'Antioquia' => [
                // Esta línea sirve para asignarle Medellín, que ya existía.
                'existing' => ['Medellín'],
                // Esta línea sirve para agregarle ciudades nuevas.
                'new' => ['Bello', 'Envigado', 'Itagüí', 'Rionegro', 'Marinilla', 'Apartadó'],
            ],
            // Esta línea sirve para definir Cundinamarca.
            'Cundinamarca' => [
                // Esta línea sirve para asignarle Bogotá, que ya existía.
                'existing' => ['Bogotá'],
                // Esta línea sirve para agregarle ciudades nuevas.
                'new' => ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá'],
            ],
            // Esta línea sirve para definir Valle del Cauca con Cali.
            'Valle del Cauca' => ['existing' => ['Cali'], 'new' => []],
            // Esta línea sirve para definir Atlántico con Barranquilla.
            'Atlántico' => ['existing' => ['Barranquilla'], 'new' => []],
            // Esta línea sirve para definir Bolívar con Cartagena.
            'Bolívar' => ['existing' => ['Cartagena'], 'new' => []],
            // Esta línea sirve para definir Santander con Bucaramanga.
            'Santander' => ['existing' => ['Bucaramanga'], 'new' => []],
            // Esta línea sirve para definir Risaralda con Pereira.
            'Risaralda' => ['existing' => ['Pereira'], 'new' => []],
            // Esta línea sirve para definir Caldas con Manizales.
            'Caldas' => ['existing' => ['Manizales'], 'new' => []],
            // Esta línea sirve para definir Magdalena con Santa Marta.
            'Magdalena' => ['existing' => ['Santa Marta'], 'new' => []],
        ];

        // Esta línea sirve para recorrer cada departamento con sus ciudades.
        foreach ($departments as $departmentName => $cities) {
            // Esta línea sirve para buscar si el departamento ya existe.
            $stateId = DB::table('states')->where('country_id', $colombiaId)->where('name', $departmentName)->value('id');
            // Esta línea sirve para revisar si no existe.
            if (! $stateId) {
                // Esta línea sirve para crear el departamento y obtener su id.
                $stateId = DB::table('states')->insertGetId([
                    // Esta línea sirve para guardar el id de Colombia.
                    'country_id' => $colombiaId,
                    // Esta línea sirve para guardar el nombre del departamento.
                    'name' => $departmentName,
                    // Esta línea sirve para guardar la fecha de creación.
                    'created_at' => now(),
                    // Esta línea sirve para guardar la fecha de actualización.
                    'updated_at' => now(),
                ]);
            }

            // Esta línea sirve para actualizar las ciudades que ya existían.
            DB::table('cities')
                // Esta línea sirve para filtrar las de Colombia.
                ->where('country_id', $colombiaId)
                // Esta línea sirve para filtrar las que pertenecen a este departamento.
                ->whereIn('name', $cities['existing'])
                // Esta línea sirve para asignarles el departamento.
                ->update(['state_id' => $stateId]);

            // Esta línea sirve para revisar si hay ciudades nuevas.
            if ($cities['new'] !== []) {
                // Esta línea sirve para armar las filas de las ciudades nuevas.
                $rows = array_map(fn (string $city) => [
                    // Esta línea sirve para guardar el id de Colombia.
                    'country_id' => $colombiaId,
                    // Esta línea sirve para guardar el id del departamento.
                    'state_id' => $stateId,
                    // Esta línea sirve para guardar el nombre de la ciudad.
                    'name' => $city,
                    // Esta línea sirve para guardar la fecha de creación.
                    'created_at' => now(),
                    // Esta línea sirve para guardar la fecha de actualización.
                    'updated_at' => now(),
                    // Esta línea sirve para pasar la lista de ciudades nuevas a recorrer.
                ], $cities['new']);

                // Esta línea sirve para insertar las ciudades nuevas, o actualizarlas si ya existían.
                DB::table('cities')->upsert($rows, ['country_id', 'name'], ['state_id', 'updated_at']);
            }
        }
    }

    // Esta línea sirve para declarar el método que crea el departamento "Nacional" para los demás países.
    private function seedNationalPlaceholderForOtherCountries(): void
    {
        // Esta línea sirve para obtener el id de Colombia.
        $colombiaId = Country::query()->where('code', 'CO')->value('id');

        // Esta línea sirve para consultar los países.
        Country::query()
            // Esta línea sirve para excluir a Colombia.
            ->where('id', '!=', $colombiaId)
            // Esta línea sirve para traer solo el id.
            ->select(['id'])
            // Esta línea sirve para recorrerlos de a 50.
            ->chunkById(50, function ($countries) {
                // Esta línea sirve para recorrer cada país del bloque.
                foreach ($countries as $country) {
                    // Esta línea sirve para buscar si ya tiene el departamento "Nacional".
                    $stateId = DB::table('states')->where('country_id', $country->id)->where('name', 'Nacional')->value('id');
                    // Esta línea sirve para revisar si no lo tiene.
                    if (! $stateId) {
                        // Esta línea sirve para crear el departamento "Nacional" y obtener su id.
                        $stateId = DB::table('states')->insertGetId([
                            // Esta línea sirve para guardar el id del país.
                            'country_id' => $country->id,
                            // Esta línea sirve para guardar el nombre "Nacional".
                            'name' => 'Nacional',
                            // Esta línea sirve para guardar la fecha de creación.
                            'created_at' => now(),
                            // Esta línea sirve para guardar la fecha de actualización.
                            'updated_at' => now(),
                        ]);
                    }

                    // Esta línea sirve para actualizar las ciudades del país.
                    DB::table('cities')
                        // Esta línea sirve para filtrar por el país.
                        ->where('country_id', $country->id)
                        // Esta línea sirve para filtrar las que todavía no tienen departamento.
                        ->whereNull('state_id')
                        // Esta línea sirve para asignarles el departamento "Nacional".
                        ->update(['state_id' => $stateId]);
                }
            });
    }
}
