<?php

namespace App\Console\Commands;

use App\Models\Country;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/**
 * ETL de una sola vez (re-corrible) que reemplaza el placeholder "Nacional"
 * de StateSeeder con datos reales de departamentos/estados y ciudades para
 * TODOS los países, tomados de dr5hn/countries-states-cities-database
 * (MIT). Sin dependencia de red en runtime — esto puebla la DB local una
 * vez (o cada tanto), OnboardingController siempre lee de `states`/`cities`
 * locales.
 *
 * Estrictamente aditivo: nunca borra ni renombra un Country/State/City
 * existente. La única excepción es el placeholder "Nacional" que
 * StateSeeder creó para países sin datos reales — se borra por país SOLO
 * si, tras el import, ya no tiene ninguna ciudad apuntándole (se verifica
 * con una query antes de borrar, nunca se asume). Si un país no tiene
 * datos reales en la fuente, su "Nacional" queda intacto (sigue siendo la
 * única opción de estado para ese país) — más vale una opción de más que
 * perder la única que tenía.
 *
 * Cachea los JSON de ciudades descargados en storage/app/location-import/
 * para poder resumir sin re-descargar 223 archivos si el comando se corta
 * a la mitad; `--fresh` fuerza re-descarga.
 */
class ImportLocationData extends Command
{
    protected $signature = 'location:import
        {--only= : Lista de códigos ISO2 separados por coma (ej. CO,MX,ES) para limitar el import}
        {--skip-cities : Solo importar countries+states, saltar el import (lento) de ciudades}
        {--fresh : Forzar re-descarga de los JSON de ciudades aunque ya estén cacheados}';

    protected $description = 'Importa países/estados/ciudades reales desde countries-states-cities-database hacia la DB local (reemplaza el placeholder "Nacional").';

    private const COUNTRIES_CSV_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/csv/countries.csv';

    private const STATES_CSV_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/csv/states.csv';

    private const CITY_JSON_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/contributions/cities/%s.json';

    private const CACHE_DIR = 'location-import';

    public function handle(): int
    {
        // El JSON de ciudades de países grandes (US, ID, BR...) pesa varios
        // MB decodificado en memoria — sin límite para no abortar a mitad
        // de país (procesamos y liberamos país por país, no acumulamos).
        ini_set('memory_limit', '-1');
        set_time_limit(0);

        $only = $this->option('only')
            ? array_map(fn (string $c) => strtoupper(trim($c)), explode(',', $this->option('only')))
            : null;

        $this->info('Paso 1/3 — países y departamentos/estados desde el CSV maestro...');
        $countryIdByCode = $this->importCountries();
        $stateIdByCountryAndCode = $this->importStates($countryIdByCode);

        if ($this->option('skip-cities')) {
            $this->info('--skip-cities: se omite el import de ciudades.');

            return self::SUCCESS;
        }

        $this->info('Paso 2/3 — ciudades por país (esto tarda varios minutos)...');
        $this->importCities($countryIdByCode, $stateIdByCountryAndCode, $only);

        $this->info('Paso 3/3 — limpiando placeholders "Nacional" que quedaron huérfanos...');
        $this->cleanupOrphanedNacionalStates();

        $this->info('Listo.');

        return self::SUCCESS;
    }

    /**
     * @return array<string, int> iso2 (mayúsculas) => id local
     */
    private function importCountries(): array
    {
        $rows = $this->readCsv(self::COUNTRIES_CSV_URL, 'countries.csv');

        $existing = Country::query()->pluck('id', 'code')->all(); // 'CO' => 1
        $existingByCode = [];
        foreach ($existing as $code => $id) {
            $existingByCode[strtoupper((string) $code)] = $id;
        }

        $toInsert = [];
        foreach ($rows as $row) {
            $code = strtoupper(trim($row['iso2'] ?? ''));
            $name = trim($row['name'] ?? '');
            if ($code === '' || $name === '' || isset($existingByCode[$code])) {
                continue;
            }
            $toInsert[$code] = $name;
        }

        if ($toInsert !== []) {
            $now = now();
            $rowsToInsert = array_map(fn (string $code, string $name) => [
                'code' => $code,
                'name' => $name,
                'created_at' => $now,
                'updated_at' => $now,
            ], array_keys($toInsert), array_values($toInsert));

            foreach (array_chunk($rowsToInsert, 200) as $chunk) {
                DB::table('countries')->insertOrIgnore($chunk);
            }
            $this->line('  '.count($toInsert).' países nuevos insertados (faltaban en la base local).');
        } else {
            $this->line('  Sin países nuevos — la base local ya cubre todo lo que trae el CSV.');
        }

        $map = [];
        foreach (Country::query()->pluck('id', 'code') as $code => $id) {
            $map[strtoupper((string) $code)] = $id;
        }

        return $map;
    }

    /**
     * @param  array<string, int>  $countryIdByCode
     * @return array<string, array<string, int>> country_code => [state_code (iso2 del state) => state_id local]
     */
    private function importStates(array $countryIdByCode): array
    {
        $rows = $this->readCsv(self::STATES_CSV_URL, 'states.csv');

        // Agrupar filas de la fuente por country_code para no reconsultar
        // la DB fila por fila.
        $byCountry = [];
        foreach ($rows as $row) {
            $countryCode = strtoupper(trim($row['country_code'] ?? ''));
            if ($countryCode === '' || ! isset($countryIdByCode[$countryCode])) {
                continue;
            }
            $byCountry[$countryCode][] = $row;
        }

        $stateIdByCountryAndCode = [];
        $totalInserted = 0;
        $now = now();

        foreach ($byCountry as $countryCode => $countryRows) {
            $countryId = $countryIdByCode[$countryCode];

            $existingByName = DB::table('states')->where('country_id', $countryId)->pluck('id', 'name')->all();

            $toInsert = [];
            foreach ($countryRows as $row) {
                $name = trim($row['name'] ?? '');
                if ($name === '' || isset($existingByName[$name])) {
                    continue;
                }
                // Puede haber states.csv con nombres duplicados dentro del
                // mismo país en casos raros de la fuente — nos quedamos con
                // el primero.
                if (isset($toInsert[$name])) {
                    continue;
                }
                $toInsert[$name] = [
                    'country_id' => $countryId,
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if ($toInsert !== []) {
                foreach (array_chunk(array_values($toInsert), 200) as $chunk) {
                    DB::table('states')->insertOrIgnore($chunk);
                }
                $totalInserted += count($toInsert);
            }

            // Releer para tener id local de TODOS los states del país
            // (los que ya existían + los recién insertados).
            $nameToId = DB::table('states')->where('country_id', $countryId)->pluck('id', 'name');

            $codeMap = [];
            foreach ($countryRows as $row) {
                $name = trim($row['name'] ?? '');
                $stateCode = strtoupper(trim($row['iso2'] ?? ''));
                if ($stateCode === '' || ! isset($nameToId[$name])) {
                    continue;
                }
                $codeMap[$stateCode] = $nameToId[$name];
            }
            $stateIdByCountryAndCode[$countryCode] = $codeMap;
        }

        $this->line("  {$totalInserted} departamentos/estados nuevos insertados en ".count($byCountry).' países.');

        return $stateIdByCountryAndCode;
    }

    /**
     * @param  array<string, int>  $countryIdByCode
     * @param  array<string, array<string, int>>  $stateIdByCountryAndCode
     * @param  array<int, string>|null  $only
     */
    private function importCities(array $countryIdByCode, array $stateIdByCountryAndCode, ?array $only): void
    {
        $codes = array_keys($countryIdByCode);
        sort($codes);
        if ($only !== null) {
            $codes = array_values(array_intersect($codes, $only));
        }

        $total = count($codes);
        $i = 0;

        foreach ($codes as $code) {
            $i++;
            $countryId = $countryIdByCode[$code];
            $codeMap = $stateIdByCountryAndCode[$code] ?? [];

            try {
                $json = $this->fetchCityJson($code);
            } catch (\Throwable $e) {
                // Un solo país con problema de red (timeout, DNS, etc.) no
                // debe tirar abajo horas de progreso ya hecho — se loguea
                // y se sigue; el comando es re-corrible, así que una
                // segunda pasada retoma justo los que fallaron (los que ya
                // se cachearon en storage/app/location-import/cities/ se
                // saltan la descarga y son casi instantáneos).
                $this->warn("  [{$i}/{$total}] {$code}: error de red ({$e->getMessage()}), se omite — reintentar con otra corrida del comando.");

                continue;
            }
            if ($json === null) {
                $this->line("  [{$i}/{$total}] {$code}: sin archivo de ciudades en la fuente, se omite.");

                continue;
            }

            if ($codeMap === []) {
                $this->line("  [{$i}/{$total}] {$code}: sin estados reales resueltos, se omite (quedan las ciudades ya existentes).");
                unset($json);

                continue;
            }

            $decoded = json_decode($json, true, flags: JSON_BIGINT_AS_STRING);
            unset($json);

            if (! is_array($decoded)) {
                $this->warn("  [{$i}/{$total}] {$code}: JSON inválido, se omite.");

                continue;
            }

            $now = now();
            $rows = [];
            $seenInBatch = [];
            $matched = 0;
            $skippedNoState = 0;

            foreach ($decoded as $city) {
                $name = trim((string) ($city['name'] ?? ''));
                $stateCode = strtoupper(trim((string) ($city['state_code'] ?? '')));
                if ($name === '' || $stateCode === '' || ! isset($codeMap[$stateCode])) {
                    $skippedNoState++;

                    continue;
                }
                $stateId = $codeMap[$stateCode];

                // El propio JSON fuente trae algún duplicado exacto
                // (mismo estado + mismo nombre) en un puñado de países —
                // el upsert lo tolera igual, pero evitamos filas repetidas
                // en el mismo lote de insert.
                $key = $stateId.'|'.$name;
                if (isset($seenInBatch[$key])) {
                    continue;
                }
                $seenInBatch[$key] = true;

                $rows[] = [
                    'country_id' => $countryId,
                    'state_id' => $stateId,
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $matched++;

                if (count($rows) >= 500) {
                    DB::table('cities')->upsert($rows, ['state_id', 'name'], ['country_id', 'updated_at']);
                    $rows = [];
                }
            }

            if ($rows !== []) {
                DB::table('cities')->upsert($rows, ['state_id', 'name'], ['country_id', 'updated_at']);
            }

            unset($decoded, $seenInBatch);

            $this->line("  [{$i}/{$total}] {$code}: {$matched} ciudades importadas, {$skippedNoState} omitidas (sin estado resuelto).");
        }
    }

    private function cleanupOrphanedNacionalStates(): void
    {
        $countriesWithRealStates = DB::table('states')
            ->where('name', '!=', 'Nacional')
            ->distinct()
            ->pluck('country_id');

        $candidates = DB::table('states')
            ->where('name', 'Nacional')
            ->whereIn('country_id', $countriesWithRealStates)
            ->get(['id', 'country_id']);

        $deleted = 0;
        foreach ($candidates as $state) {
            // Confirmar (no asumir) que ninguna ciudad sigue apuntando a
            // este "Nacional" antes de borrarlo.
            $stillReferenced = DB::table('cities')->where('state_id', $state->id)->exists();
            if ($stillReferenced) {
                continue;
            }
            DB::table('states')->where('id', $state->id)->delete();
            $deleted++;
        }

        $this->line("  {$deleted} placeholders \"Nacional\" huérfanos eliminados (de ".count($candidates).' candidatos con estados reales disponibles).');
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function readCsv(string $url, string $cacheName): array
    {
        $path = self::CACHE_DIR.'/'.$cacheName;
        if ($this->option('fresh') || ! Storage::exists($path)) {
            $response = Http::timeout(60)->get($url);
            $response->throw();
            Storage::put($path, $response->body());
        }

        // Vía archivo real (no php://memory + split manual de líneas): los
        // CSV fuente tienen campos entrecomillados que pueden contener
        // comas y, en algún caso raro, saltos de línea — fgetcsv() sobre
        // un stream de archivo real los maneja correctamente; partir el
        // contenido por línea a mano de antemano los rompería.
        $handle = fopen(Storage::path($path), 'r');

        $header = fgetcsv($handle);
        $rows = [];
        while (($data = fgetcsv($handle)) !== false) {
            if (count($data) !== count($header)) {
                continue;
            }
            $rows[] = array_combine($header, $data);
        }
        fclose($handle);

        return $rows;
    }

    private function fetchCityJson(string $isoCode): ?string
    {
        $path = self::CACHE_DIR.'/cities/'.$isoCode.'.json';

        if (! $this->option('fresh') && Storage::exists($path)) {
            return Storage::get($path);
        }

        $url = sprintf(self::CITY_JSON_URL, $isoCode);
        $response = Http::timeout(120)->retry(3, 2000, throw: false)->get($url);

        if ($response->status() === 404) {
            return null;
        }
        $response->throw();

        $body = $response->body();
        Storage::put($path, $body);

        return $body;
    }
}
