<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Seed base de países + ciudades principales, suficiente para arrancar
     * rankings por ubicación en desarrollo. Se amplía en fases posteriores.
     */
    public function run(): void
    {
        $data = [
            'MX' => ['name' => 'México', 'cities' => ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla']],
            'CO' => ['name' => 'Colombia', 'cities' => ['Bogotá', 'Medellín', 'Cali', 'Barranquilla']],
            'AR' => ['name' => 'Argentina', 'cities' => ['Buenos Aires', 'Córdoba', 'Rosario']],
            'ES' => ['name' => 'España', 'cities' => ['Madrid', 'Barcelona', 'Valencia', 'Sevilla']],
            'US' => ['name' => 'Estados Unidos', 'cities' => ['Miami', 'Los Ángeles', 'Nueva York', 'Houston']],
            'CL' => ['name' => 'Chile', 'cities' => ['Santiago', 'Valparaíso']],
            'PE' => ['name' => 'Perú', 'cities' => ['Lima', 'Arequipa']],
        ];

        foreach ($data as $code => $entry) {
            $country = Country::query()->updateOrCreate(
                ['code' => $code],
                ['name' => $entry['name']]
            );

            foreach ($entry['cities'] as $cityName) {
                City::query()->updateOrCreate([
                    'country_id' => $country->id,
                    'name' => $cityName,
                ]);
            }
        }
    }
}
